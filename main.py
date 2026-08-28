"""
MarketSphere Platform Primary Production Entrypoint.
Orchestrates backend ASGI server and Next.js frontend web cluster.
"""
import os
import sys
import subprocess
import time
import signal
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("marketsphere.master")

def start_platform():
    logger.info("Initializing MarketSphere Autonomous Multi-Vendor Commerce Monolith...")
    root_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(root_dir, "backend")
    frontend_dir = os.path.join(root_dir, "frontend")

    logger.info("Starting FastAPI REST API Gateway on http://127.0.0.1:8000...")
    backend_cmd = [sys.executable, "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
    backend_proc = subprocess.Popen(backend_cmd, cwd=backend_dir)

    logger.info("Starting Next.js 14 Web Portal on http://localhost:3000...")
    frontend_cmd = ["npm", "start"]
    if sys.platform == "win32":
        frontend_cmd = ["npm.cmd", "start"]
    
    frontend_proc = subprocess.Popen(frontend_cmd, cwd=frontend_dir)

    logger.info("All MarketSphere services launched successfully. Press Ctrl+C to stop.")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        logger.info("Shutting down platform processes gracefully...")
        backend_proc.terminate()
        frontend_proc.terminate()

if __name__ == "__main__":
    start_platform()
