(async () => {
  const providersRes = await fetch("http://localhost:3000/api/auth/providers");
  const csrfRes = await fetch("http://localhost:3000/api/auth/csrf");
  const csrfData = await csrfRes.json();
  console.log("CSRF:", csrfData.csrfToken);

  const res = await fetch("http://localhost:3000/api/auth/signin/google", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": csrfRes.headers.get("set-cookie") || ""
    },
    body: `csrfToken=${csrfData.csrfToken}`
  });
  console.log(await res.text());
})();
