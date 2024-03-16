const PATTERN = "-([^-]+-[0-9.]+)-(any|x86_64).(pkg.tar.[0-9a-z]*)</a> +(.+\\d) +(\\w+)"
const ARCHIVE_URLS = [
    "https://asia.archive.pkgbuild.com/packages",
    "https://europe.archive.pkgbuild.com/packages",
    "https://america.archive.pkgbuild.com/packages",
    "https://archive.archlinux.org/packages",
]
const corsHeaders = {
    'Access-Control-Allow-Headers': "*",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET",
}

async function get_pkg_history(mirror, pkg_name) {
    let t, matches = []
    const api_url = `https://archive.archlinux.org/packages/${pkg_name[0]}/${pkg_name}/`
    const base_url = `${ARCHIVE_URLS[mirror]}/${pkg_name[0]}/${pkg_name}/`
    const pattern = new RegExp(pkg_name + PATTERN, "g")
    const response = await fetch(api_url)
    const text = await response.text()
    while (t = pattern.exec(text)) {
        matches.push(t.slice(1, 6))
    }
    return [base_url, matches]
}

async function match_package(mirror, pkg_name) {
    const history_dict = {}
    const [base_url, pkg_list] = await get_pkg_history(mirror, pkg_name)
    pkg_list.forEach(pkg => {
        const [version, arch, suffix, raw_time, size] = pkg
        const url = `${base_url}${pkg_name}-${version}-${arch}.${suffix}`
        const date = new Date(raw_time.replace(/(\d+)-(\w+)-(\d+)/, '$3-$2-$1'))
        const fmt_time = date.toISOString().replace('T', ' ').substring(0, 19)
        history_dict[date.getTime()] = [version, size, fmt_time, url]
    })
    const keys = Object.keys(history_dict)
    keys.sort().reverse()
    return keys.map(key => history_dict[key])
}

export default {
    async fetch(request) {
        const url = new URL(request.url)
        if (url.pathname == '/api') {
            const params = url.searchParams
            const pkg_name = params.get("p")
            if (!pkg_name) { return new Response(JSON.stringify([]), { headers: corsHeaders }) }
            const mirror = parseInt(params.get("m")) || 0
            const data = await match_package(mirror, pkg_name)
            return new Response(JSON.stringify(data), { headers: corsHeaders })
        } else {
            return new Response("Ayaya! https://github.com/Brx86/AA-Search")
        }
    }
}