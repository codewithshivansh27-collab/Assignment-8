const container = document.getElementById("newsContainer");

async function fetchNews(query = "technology") {

    const url = `https://hn.algolia.com/api/v1/search?query=${query}`;

    const res = await fetch(url);
    const data = await res.json();

    showNews(data.hits);

}

function showNews(news) {

    container.innerHTML = "";

    news.forEach(article => {

        if (!article.title) return;

        const div = document.createElement("div");
        div.className = "news";

        div.innerHTML = `
<h3>${article.title}</h3>
<p>Author: ${article.author}</p>
<a href="${article.url}" target="_blank">Read Full Article</a>
`;

        container.appendChild(div);

    });

}

function searchNews() {

    const query = document.getElementById("searchInput").value;

    if (query === "") return;

    fetchNews(query);

}

// default news on page load
fetchNews();