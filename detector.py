import magic
import mimetypes

def detectFileType(file_path:str) -> dict:
    """
    Detects file type using file content, not extension.
    Returns normalized metadata.
    """

    mime = magic.from_file(file_path, mime=True)
    ext = mimetypes.guess_extension(mime)

    return{
        "mime": mime,
        "extension": ext,
        "category": categorize(mime),
    }

def categorize(mime: str) -> str:
    if mime == "application/pdf":
        return "pdf"
    if mime.startswith("image/"):
        return "image"
    if mime in (
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
    ): 
        return "word"
    return "unknown"