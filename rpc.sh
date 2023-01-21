docker run --rm -ti \
  --platform linux/amd64 \
  --name stellar \
  -p 8000:8000 \
  stellar/quickstart:soroban-dev@sha256:8968d5c3344fe447941ebef12c5bede6f15ba29b63317a488c16c5d5842e4a71 \
  --futurenet \
  --enable-soroban-rpc \
  --protocol-version 20