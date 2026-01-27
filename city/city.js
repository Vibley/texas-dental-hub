// ---- CITY CONFIG (expand anytime) ----
const cityMap = {
  "houston": {
    name: "Houston",
    state: "TX",
    intro: "Discover trusted dentists and family dental clinics in Houston, Texas. Browse local providers and contact clinics directly."
  },
  "katy": {
    name: "Katy",
    state: "TX",
    intro: "Find top-rated dentists and family dental clinics in Katy, TX. Verified local providers you can trust."
  },
  "sugar-land": {
    name: "Sugar Land",
    state: "TX",
    intro: "Looking for a dentist in Sugar Land, TX? Explore verified dental clinics and book with confidence."
  }
};

// ---- MOCK CLINIC DATA (replace with Supabase later) ----

// ---- LOAD CLINICS FROM SUPABASE ----
async function loadClinics(citySlug) {
  const { data, error } = await supabase
    .from("clinics")
    .select("name, phone, services")
    .eq("active", true)
    .ilike("city", citySlug.replace("-", " "))
    .order("featured", { ascending: false });

  if (error) {
    console.error(error);
    document.getElementById("clinic-list").innerHTML =
      "<p>Unable to load clinics.</p>";
    return;
  }

  const list = document.getElementById("clinic-list");
  list.innerHTML = "";

  if (!data.length) {
    list.innerHTML = "<p>No clinics listed yet.</p>";
    return;
  }

  data.forEach(c => {
    const div = document.createElement("div");
    div.className = "clinic-card";
    div.innerHTML = `
      <h3>${c.name}</h3>
      <p>📞 ${c.phone || "Call for details"}</p>
      <p>Services: ${(c.services || []).join(", ")}</p>
    `;
    list.appendChild(div);
  });
}

loadClinics(citySlug);


// ---- GET CITY FROM URL ----
const citySlug = window.location.pathname.split("/").filter(Boolean).pop();
const city = cityMap[citySlug];

if (!city) {
  document.getElementById("city-title").innerText = "City not found";
  throw new Error("Invalid city");
}

// ---- SEO META ----
document.title = `Dentists in ${city.name} ${city.state} | TexasDentalHub`;
document.querySelector('meta[name="description"]').setAttribute(
  "content",
  `Find verified dentists and family dental clinics in ${city.name}, ${city.state}. Call clinics directly or request appointments online.`
);

document.querySelector('link[rel="canonical"]').setAttribute(
  "href",
  `https://texasdentalhub.com/city/${citySlug}`
);

// ---- PAGE CONTENT ----
document.getElementById("city-title").innerText =
  `Dentists in ${city.name}, ${city.state}`;

document.getElementById("city-intro").innerText = city.intro;

// ---- CLINIC LIST ----
const list = document.getElementById("clinic-list");
const filtered = clinics.filter(c => c.city === citySlug);

if (filtered.length === 0) {
  list.innerHTML = "<p>No clinics listed yet.</p>";
} else {
  filtered.forEach(c => {
    const div = document.createElement("div");
    div.className = "clinic-card";
    div.innerHTML = `
      <h3>${c.name}</h3>
      <p>📞 ${c.phone}</p>
      <p>Services: ${c.services}</p>
    `;
    list.appendChild(div);
  });
}

// ---- SCHEMA (SEO GOLD) ----
document.getElementById("schema-json").textContent = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": `Dentists in ${city.name}, ${city.state}`,
  "url": `https://texasdentalhub.com/city/${citySlug}`,
  "about": {
    "@type": "Place",
    "name": `${city.name}, ${city.state}`
  }
});
