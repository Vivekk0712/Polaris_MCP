import os
import sys
import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pydantic_settings import BaseSettings

# Add the project root to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '.')))

from tools import user_tools, chat_tools
from ai_client import generate_from_prompt
from supabase_client import init_supabase

class Settings(BaseSettings):
    GEMINI_API_KEY: str
    SUPABASE_URL: str
    SUPABASE_SERVICE_ROLE_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    init_supabase(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

class ChatRequest(BaseModel):
    user_id: str
    message: str
    metadata: dict | None = None
    user_name: str | None = None
    user_email: str | None = None

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/mcp/query")
async def mcp_query(request: ChatRequest):
    user_id = request.user_id
    user_message = request.message
    user_name = request.user_name
    user_email = request.user_email
    logger.info(f"Received chat request from user {user_id} (name: {user_name}, email: {user_email})")

    try:
        # 1. Get or create user profile with name/email
        logger.info("Getting/creating user profile...")
        logger.info(f"Calling get_user_profile with: firebase_uid={user_id}, email={user_email}, name={user_name}")
        user = user_tools.get_user_profile(user_id, user_email, user_name)
        logger.info(f"User profile result: {user}")

        # 2. Get chat history
        logger.info("Getting chat history...")
        chat_history = chat_tools.get_chat_history(user_id)
        logger.info(f"Chat history: {chat_history}")
        print(f"DEBUG: MCP server returning chat history: {chat_history}")

        # 3. Generate response with user context
        logger.info("Generating AI response...")
        assistant_response = generate_from_prompt(user_message, chat_history, user_name)
        logger.info(f"Assistant response generated successfully")

        # 4. Store messages
        logger.info("Storing user message...")
        chat_tools.store_message(user_id, "user", user_message)
        logger.info("Storing assistant message...")
        chat_tools.store_message(user_id, "assistant", assistant_response)
        logger.info("Messages stored successfully")

        # 5. Return response
        return {"reply": assistant_response}
    except Exception as e:
        logger.error(f"Error processing chat request for user {user_id}: {str(e)}")
        logger.error(f"Error type: {type(e).__name__}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/mcp/history")
async def mcp_history(user_id: str):
    logger.info(f"Fetching chat history for user {user_id}")
    try:
        chat_history = chat_tools.get_chat_history(user_id)
        return chat_history
    except Exception as e:
        logger.error(f"Error fetching chat history for user {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.delete("/mcp/clear-chat")
async def mcp_clear_chat(user_id: str):
    logger.info(f"Clearing chat history for user {user_id}")
    try:
        result = chat_tools.clear_chat_history(user_id)
        logger.info(f"Successfully cleared chat history for user {user_id}")
        return {"message": "Chat history cleared successfully", "result": result}
    except Exception as e:
        logger.error(f"Error clearing chat history for user {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# ============= ML Project Endpoints =============

class MLProjectRequest(BaseModel):
    user_id: str
    message: str
    user_name: str | None = None
    user_email: str | None = None

@app.post("/api/ml/planner")
async def ml_planner(request: MLProjectRequest):
    """
    Planner Agent endpoint - Creates ML project from user description
    """
    logger.info(f"ML Planner request from user {request.user_id}: {request.message}")
    
    try:
        from supabase_client import get_supabase_client
        supabase = get_supabase_client()
        
        # TODO: Integrate with actual Planner Agent
        # For now, create a mock project
        project_data = {
            "user_id": request.user_id,
            "name": f"ML Project - {request.message[:50]}",
            "task_type": "image_classification",
            "framework": "pytorch",
            "dataset_source": "kaggle",
            "search_keywords": ["dataset", "classification"],
            "status": "pending_dataset",
            "metadata": {
                "user_message": request.message,
                "created_via": "chat"
            }
        }
        
        result = supabase.table("projects").insert(project_data).execute()
        project_id = result.data[0]["id"] if result.data else None
        
        logger.info(f"Created project {project_id} for user {request.user_id}")
        
        return {
            "reply": f"✅ Project created successfully! I'll start working on finding the best dataset for your project.",
            "projectId": project_id,
            "status": "pending_dataset"
        }
    except Exception as e:
        logger.error(f"Error in ML Planner: {str(e)}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ml/projects")
async def get_ml_projects(user_id: str):
    """
    Get all ML projects for a user
    """
    logger.info(f"Fetching ML projects for user {user_id}")
    
    try:
        from supabase_client import get_supabase_client
        supabase = get_supabase_client()
        
        result = supabase.table("projects").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        
        projects = result.data if result.data else []
        logger.info(f"Found {len(projects)} projects for user {user_id}")
        
        return {"projects": projects}
    except Exception as e:
        logger.error(f"Error fetching ML projects: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ml/projects/{project_id}")
async def get_ml_project(project_id: str, user_id: str):
    """
    Get specific ML project details
    """
    logger.info(f"Fetching project {project_id} for user {user_id}")
    
    try:
        from supabase_client import get_supabase_client
        supabase = get_supabase_client()
        
        result = supabase.table("projects").select("*").eq("id", project_id).eq("user_id", user_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Project not found")
        
        project = result.data[0]
        
        # Also fetch related datasets and models
        datasets = supabase.table("datasets").select("*").eq("project_id", project_id).execute()
        models = supabase.table("models").select("*").eq("project_id", project_id).execute()
        
        project["datasets"] = datasets.data if datasets.data else []
        project["models"] = models.data if models.data else []
        
        return {"project": project}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching project: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ml/projects/{project_id}/logs")
async def get_project_logs(project_id: str, user_id: str):
    """
    Get agent logs for a project
    """
    logger.info(f"Fetching logs for project {project_id}")
    
    try:
        from supabase_client import get_supabase_client
        supabase = get_supabase_client()
        
        # Verify project belongs to user
        project = supabase.table("projects").select("id").eq("id", project_id).eq("user_id", user_id).execute()
        if not project.data:
            raise HTTPException(status_code=404, detail="Project not found")
        
        logs = supabase.table("agent_logs").select("*").eq("project_id", project_id).order("created_at", desc=False).execute()
        
        return {"logs": logs.data if logs.data else []}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching logs: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ml/projects/{project_id}/download")
async def download_model(project_id: str, user_id: str):
    """
    Download trained model bundle
    """
    logger.info(f"Download request for project {project_id}")
    
    try:
        from supabase_client import get_supabase_client
        from fastapi.responses import FileResponse
        
        supabase = get_supabase_client()
        
        # Verify project and get model info
        project = supabase.table("projects").select("*").eq("id", project_id).eq("user_id", user_id).execute()
        if not project.data:
            raise HTTPException(status_code=404, detail="Project not found")
        
        project_data = project.data[0]
        if project_data["status"] not in ["completed", "export_ready"]:
            raise HTTPException(status_code=400, detail="Model not ready for download")
        
        # TODO: Implement actual model download from GCP
        # For now, return a placeholder response
        raise HTTPException(status_code=501, detail="Model download not yet implemented")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error downloading model: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ml/projects/{project_id}/test")
async def test_model(project_id: str):
    """
    Test model with uploaded image
    """
    logger.info(f"Test request for project {project_id}")
    
    try:
        # TODO: Implement model testing
        # This would load the model and run inference
        raise HTTPException(status_code=501, detail="Model testing not yet implemented")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error testing model: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
