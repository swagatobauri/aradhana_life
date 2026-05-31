"""knowledge_lookup — RAG over curated astrology notes."""

# pyrefly: ignore [missing-import]
from langchain_core.tools import tool
from backend.rag.vectorstore import get_retriever

@tool
def knowledge_lookup(query: str) -> str:
    """
    Looks up astrological knowledge from the curated notes database.
    Use this to get definitions, meanings of planets, houses, signs, aspects, 
    or differences between Vedic and Western astrology.
    
    Args:
        query: A specific search query like "meaning of Saturn return" or "7th house".
        
    Returns:
        A string containing the most relevant knowledge excerpts.
    """
    try:
        retriever = get_retriever()
        docs = retriever.invoke(query)
        
        if not docs:
            return "No relevant astrological knowledge found for this query."
            
        results = []
        for i, doc in enumerate(docs):
            source = doc.metadata.get("source", "Unknown Source")
            # Just extract the filename for cleaner output
            import os
            source_name = os.path.basename(source)
            results.append(f"--- Excerpt {i+1} (Source: {source_name}) ---\n{doc.page_content}")
            
        return "\n\n".join(results)
    except Exception as e:
        return f"Knowledge lookup failed: {str(e)}"
