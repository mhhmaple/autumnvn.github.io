export async function onRequestGet({ env }) {
    const query = `{
        a: repository(owner: "AutumnVN", name: "chino.pages.dev") { stargazers { totalCount } forks { totalCount } }
        b: repository(owner: "AutumnVN", name: "debloat-premid") { stargazers { totalCount } forks { totalCount } }
        c: repository(owner: "AutumnVN", name: "loli") { stargazers { totalCount } forks { totalCount } }
        d: repository(owner: "AutumnVN", name: "highlight") { stargazers { totalCount } forks { totalCount } }
        e: repository(owner: "Vendicated", name: "Vencord") { stargazers { totalCount } forks { totalCount } }
        f: repository(owner: "Vencord", name: "vencord.dev") { stargazers { totalCount } forks { totalCount } }
        g: repository(owner: "ppy", name: "osu-wiki") { stargazers { totalCount } forks { totalCount } }

        z: user(login: "AutumnVN") {
            repositories(first: 100, ownerAffiliations: OWNER) {
                nodes {
                    stargazerCount
                    forkCount
                }
            }
            contributionsCollection {
                totalCommitContributions
            }
            pullRequests(first: 1) {
                totalCount
            }
            issues(first: 1) {
                totalCount
            }
            repositoriesContributedTo(first: 1, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
                totalCount
            }
        }
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

    const repos = Object.values(data);
    const stats = repos.pop();

    const statsArr = [
        stats.repositories.nodes.reduce((a, b) => a + b.stargazerCount, 0),
        stats.repositories.nodes.reduce((a, b) => a + b.forkCount, 0),
        stats.contributionsCollection.totalCommitContributions,
        stats.pullRequests.totalCount,
        stats.issues.totalCount,
        stats.repositoriesContributedTo.totalCount
    ];

    const res = repos.map(i => ([
        i.stargazers.totalCount,
        i.forks.totalCount
    ]));

    res.push(statsArr);

    return new Response(JSON.stringify(res), {
        headers: {
            'content-type': 'application/json',
            'cache-control': 'public, max-age=3600'
        }
    });
}
