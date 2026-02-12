# Stage 1: Base Python Image
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /code

# Install dependencies
# Copy only requirements to leverage Docker cache
COPY ./nexus-light-backend/requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy backend application code
COPY ./nexus-light-backend/ /code/

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
# We use 0.0.0.0 to make it accessible from outside the container
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
