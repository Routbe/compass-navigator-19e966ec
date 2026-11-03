FROM oven/bun:1.3.10-debian
USER root
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY worker/package.json worker/bun.lock ./worker/
RUN bun install --cwd worker --frozen-lockfile
COPY worker/ ./worker/
COPY src/lib/omni-ingest.ts src/lib/omni-realtime.ts ./src/lib/
USER bun
EXPOSE 8090
CMD ["bun", "run", "worker/main.ts"]