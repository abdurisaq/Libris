echo " Building frontend..."
cd frontend && pnpm build && cd ..

echo "Starting backend..."
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
