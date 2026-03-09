import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

# Menambahkan data jalan bermasalah sebagai contoh
data = [
    {
        "road_name": "Jl. Tikus Sukajadi", 
        "condition_type": "tikus", 
        "lat": -6.8915, "long": 107.5983, 
        "description": "Sangat sempit, hanya muat satu motor."
    },
    {
        "road_name": "Jl. Lubang Buaya", 
        "condition_type": "rusak", 
        "lat": -6.9000, "long": 107.6100, 
        "description": "Banyak lubang dalam, berbahaya untuk sedan."
    }
]

try:
    supabase.table("road_reports").insert(data).execute()
    print("✅ Berhasil mengisi data contoh ke Supabase!")
except Exception as e:
    print(f"❌ Error: {e}")