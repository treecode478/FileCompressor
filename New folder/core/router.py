from processors import pdf , image, docx

PROCESSOR_MAP = {
    "pdf": pdf.process,
    "image": image.process,
    "docx": docx.process,
}

def routeFile(file_type: str, file_path:str, action:str):
    """
    Routes a file to the correct processor based on its type.
    
    Parameters:
        file_type (str): Type of the file (e.g., 'pdf', 'jpg').
        file_path (str): Path to the file.
        action (str): Action to perform on the file.

    Returns:
        dict: Result from the processor.
    """
    if file_type not in PROCESSOR_MAP:
        raise ValueError("Unsupported file type")
    
    return PROCESSOR_MAP[file_type](file_path,action)