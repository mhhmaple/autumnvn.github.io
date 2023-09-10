export async function onRequestGet({ env }) {
    const query = `{
        a: repository(owner: "AutumnVN", name: "chino.pages.dev") { stargazers { totalCount } forks { totalCount } }
        b: repository(owner: "AutumnVN", name: "debloat-premid") { stargazers { totalCount } forks { totalCount } }
        c: repository(owner: "AutumnVN", name: "loli") { stargazers { totalCount } forks { totalCount } }
        d: repository(owner: "AutumnVN", name: "highlight") { stargazers { totalCount } forks { totalCount } }
        e: repository(owner: "Vendicated", name: "Vencord") { stargazers { totalCount } forks { totalCount } }
        f: repository(owner: "Vencord", name: "vencord.dev") { stargazers { totalCount } forks { totalCount } }
        g: repository(owner: "ppy", name: "osu-wiki") { stargazers { totalCount } forks { totalCount } }
    }`;

    const { data } = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'authorization': `bearer ${env.GITHUB_TOKEN}`,
            'user-agent': 'AutumnVN'
        },
        body: JSON.stringify({ query })
    }).then(r => r.json());

    const arr = Object.values(data);
    const res = [];
    for (let i = 0; i < arr.length; i++) {
        res.push({
            star: arr[i].stargazers.totalCount,
            fork: arr[i].forks.totalCount
        });
    }

    return new Response(JSON.stringify(res), {
        headers: {
            'content-type': 'application/json',
            'cache-control': 'public, max-age=3600'
        }
    });
}
