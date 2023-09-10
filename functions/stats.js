export async function onRequestGet({ env }) {
    const query = `{
        user(login: "AutumnVN") {
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

    const star = data.user.repositories.nodes.reduce((a, b) => a + b.stargazerCount, 0);
    const fork = data.user.repositories.nodes.reduce((a, b) => a + b.forkCount, 0);
    const commit = data.user.contributionsCollection.totalCommitContributions;
    const pr = data.user.pullRequests.totalCount;
    const issue = data.user.issues.totalCount;
    const repo = data.user.repositoriesContributedTo.totalCount;

    const res = [star, fork, commit, pr, issue, repo];

    return new Response(JSON.stringify(res), {
        headers: {
            'content-type': 'application/json',
            'cache-control': 'public, max-age=3600'
        }
    });
}
