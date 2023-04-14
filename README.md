# AA-Search

Arch Linux Archive Search.

Powered by [Vue3](https://cn.vuejs.org/) and [Pico](https://picocss.com/)

## Demo

[https://archive.aya1.pro/](https://archive.aya1.pro/)

## Build and run

```bash
git clone https://github.com/Brx86/AA-Search
cd AA-Search
pip install uvicorn fastapi httpx
yarn
yarn build
uvicorn app:app --port=7777
```

## Run on release

```bash
mkdir aa-search && cd aa-search
wget https://github.com/Brx86/AA-Search/releases/download/v0.1/webapp-v0.1.tar.xz
tar xf webapp-v0.1.tar.xz
pip install uvicorn fastapi httpx
uvicorn app:app --port=7777
```
