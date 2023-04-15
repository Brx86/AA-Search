# AA-Search

Arch Linux Archive Search.

Powered by [Vue3](https://cn.vuejs.org/) and [Pico](https://picocss.com/)

## Demo

[https://archive.aya1.pro/](https://archive.aya1.pro/)

![截图](https://user-images.githubusercontent.com/44391900/232202562-95238c66-4ff1-4034-810e-bcb92c57be5d.png)

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
wget https://github.com/Brx86/AA-Search/releases/download/v0.2/aa-search-v0.2.tar.xz
tar xf aa-search-v0.2.tar.xz
pip install uvicorn fastapi httpx
uvicorn app:app --port=7777
```
