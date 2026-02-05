import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def show_users():
    # 1. Connect to your local MongoDB
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.skillmatrix_db
    users_collection = db.users

    print("--- 📂 FETCHING ALL USERS FROM MONGODB ---")
    
    # 2. Fetch all documents
    cursor = users_collection.find({})
    users = await cursor.to_list(length=100)

    if not users:
        print("❌ No users found! Go sign up on the website first.")
    else:
        for user in users:
            print(f"👤 Name: {user.get('fullName')}")
            print(f"📧 Email: {user.get('email')}")
            print(f"🔑 Pass: {user.get('password')}")
            print("-" * 30)

if __name__ == "__main__":
    asyncio.run(show_users())