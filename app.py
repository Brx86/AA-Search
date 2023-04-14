import re, time
from httpx import AsyncClient
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

ARCHIVE_URLS = [
    "https://asia.archive.pkgbuild.com/packages",
    "https://europe.archive.pkgbuild.com/packages",
    "https://america.archive.pkgbuild.com/packages",
    "https://archive.archlinux.org/packages",
]
PATTERN = r"([^-]+-[0-9.]+)-(any|x86_64).(pkg.tar.[0-9a-z]*)<\/a>\s*(.*\d)\s{1,}(\w*)"


async def get_pkg_history(m, pkg_name):
    base_url = f"{ARCHIVE_URLS[m]}/{pkg_name[0]}/{pkg_name}/"
    pattern = re.compile(rf"{pkg_name}-{PATTERN}")
    async with AsyncClient() as client:
        response = await client.get(base_url)
    return base_url, pattern.findall(response.text)


async def match_package(m, pkg_name):
    history_dict = {}
    base_url, pkg_list = await get_pkg_history(m, pkg_name)
    for version, arch, suffix, raw_time, size in pkg_list:
        url = f"{base_url}{pkg_name}-{version}-{arch}.{suffix}"
        raw_time = time.strptime(raw_time, "%d-%b-%Y %H:%M")
        fmt_time = time.strftime("%Y-%m-%d %H:%M", raw_time)
        history_dict[raw_time] = (version, size, fmt_time, url)
    return [history_dict[k] for k in sorted(history_dict, reverse=True)]


@app.get("/api")
async def pkg_history(p: str, m: int = 0):
    result = await match_package(m, p)
    status = 200 if result else 404
    return JSONResponse({"status": status, "data": result})


@app.get("/")
async def index():
    return FileResponse("dist/index.html")


app.mount("/", StaticFiles(directory="dist"))
