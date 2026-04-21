FROM nvidia/cuda:12.8.1-runtime-ubuntu22.04

WORKDIR /src

RUN apt-get install -y python3
RUN apt-get install -y python3-pip
RUN apt-get install ffmpeg

COPY requirements.txt .
RUN pip install torch torchvision --index-url https://download.pytorch.org/whl/cu128
RUN pip install --no-cache-dir -r requirements.txt

COPY src ./src

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]