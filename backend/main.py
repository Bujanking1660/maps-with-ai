# uvicorn main:app --reload
import os
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv
from google import genai
from google.genai import types
from fastapi.middleware.cors import CORSMiddleware

# 1. Load Environment Variables
load_dotenv()

app = FastAPI(title="SmartRoute AI Backend")

# 2. Enable CORS (Agar React bisa akses API ini nanti)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Mengizinkan semua akses (penting untuk development)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Inisialisasi Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# 4. Inisialisasi Gemini AI
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
# Menggunakan versi gemini-2.5-flash
GEMINI_MODEL = 'gemini-2.5-flash'

# 5. Schema Data untuk Input User
class RouteQuery(BaseModel):
    user_speech: str
    current_lat: float
    current_long: float

# --- ENDPOINT UTAMA ---

@app.get("/")
def home():
    return {
        "status": "Online",
        "message": "Welcome to SmartRoute AI API",
        "docs": "/docs"
    }

@app.get("/test-supabase")
async def test_supabase():
    try:
        # Cek apakah bisa akses tabel road_reports
        response = supabase.table("road_reports").select("id").limit(1).execute()
        return {
            "status": "Success",
            "message": "Koneksi Supabase Aman!",
            "data_preview": response.data
        }
    except Exception as e:
        return {"status": "Error", "detail": str(e)}

@app.get("/test-gemini")
async def test_gemini():
    try:
        # Test AI merespon
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents="Hai Gemini, berikan satu kalimat singkat bahwa kamu siap membantu navigasi."
        )
        return {
            "status": "Success",
            "ai_response": response.text.strip()
        }
    except Exception as e:
        return {"status": "Error", "detail": str(e)}

@app.post("/analyze-route")
async def analyze_route(query: RouteQuery):
    try:
        # Prompt yang lebih komprehensif agar bertindak seperti Advanced Geocoding Engine
        prompt = f"""
        Anda adalah Smart Navigation AI dan Advanced Geocoding Engine untuk wilayah Indonesia.
        Analisis instruksi pencarian lokasi: "{query.user_speech}"
        Koordinat User Saat Ini: {query.current_lat}, {query.current_long}
        
        Tugas Anda:
        1. Identifikasi nama tempat tujuan (target_destination) dengan spesifik berdasarkan ucapan user. Pahami berbagai gaya bahasa, singkatan, slang, dan bahasa gaul Indonesia (misal: "Jaksel", "Tamsur", "Citos", "PIM", "Bintaro", "healing ke...").
        2. Perkirakan koordinat latitude dan longitude (coordinates) yang SEAKURAT DARI PENGETAHUAN ANDA untuk lokasi tersebut. Jika tidak disebutkan spesifik (misal: "Cari kopi"), cari lokasi relevan terdekat dari koordinat user yang ada di Indonesia.
        3. Identifikasi apa yang ingin dihindari user (avoid_criteria) misalnya macet, tol, banjir, jalan rusak, ganjil genap. Hasilkan array kosong jika tidak ada.
        4. Tentukan prioritas rute (priority): "waktu" (tercepat), "jarak" (terpendek), atau "kenyamanan" (rute aman/lebar).
        5. Berikan instruksi navigasi singkat layaknya asisten GPS.

        Berikan respons HANYA dalam format JSON murni TANPA teks penjelasan apapun. Gunakan struktur berikut:
        {{
          "target_destination": "Nama tempat spesifik",
          "coordinates": {{ "lat": -6.200000, "lng": 106.816666 }},
          "avoid_criteria": ["tol", "macet"],
          "priority": "waktu",
          "navigation_instruction": "Gunakan jalur arteri utama dan hindari kawasan rawan macet."
        }}
        """
        ai_raw = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            )
        )
        # ai_raw.text is already guaranteed to be a valid JSON string by the model
        ai_data = json.loads(ai_raw.text)

        # Ambil data bahaya dari Supabase berdasarkan kriteria dengan fallback
        try:
            hazards = supabase.table("road_reports").select("*").execute()
            detected_hazards = hazards.data
        except Exception as err:
            print(f"Supabase error or paused: {err}")
            detected_hazards = []

        return {
            "user_intent": ai_data,
            "detected_hazards": detected_hazards
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint tambahan untuk melihat model apa saja yang tersedia jika error 404 lagi
@app.get("/list-models")
async def list_models():
    # Dengan SDK baru, kita ambil list models
    try:
        models = [m.name for m in client.models.list()]
        return {"available_models": models}
    except Exception as e:
        return {"error": str(e)}