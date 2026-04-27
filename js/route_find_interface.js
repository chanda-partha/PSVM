let ROUTE_DATA = null;

async function loadRouteData() {
    if (ROUTE_DATA) return ROUTE_DATA;

    let combined = { routes: [] };

  
    try {
        const res = await fetch("../json/route_data.json");
        if (res.ok) {
            const json = await res.json();
            combined.routes.push(...json.routes);
        }
    } catch (e) {
        console.log("JSON load failed");
    }

    //  XML LOAD 
    try {
        const res = await fetch("../xml/routeData.xml");
        if (res.ok) {
            const text = await res.text();

            const parser = new DOMParser();
            const xml = parser.parseFromString(text, "text/xml");

            const routes = xml.getElementsByTagName("route");

            for (let i = 0; i < routes.length; i++) {
                const r = routes[i];

                combined.routes.push({
                    pickup: r.getElementsByTagName("pickup")[0]?.textContent || "",
                    destination: r.getElementsByTagName("destination")[0]?.textContent || "",
                    bus: r.getElementsByTagName("bus")[0]?.textContent || "",
                    cng: r.getElementsByTagName("cng")[0]?.textContent || "",
                    bike: r.getElementsByTagName("bike")[0]?.textContent || "",
                    rickshaw: r.getElementsByTagName("rickshaw")[0]?.textContent || "",
                    time: r.getElementsByTagName("time")[0]?.textContent || ""
                });
            }
        }
    } catch (e) {
        console.log("XML load failed");
    }

    ROUTE_DATA = combined;
    return ROUTE_DATA;
}


async function findRoute() {
    const pickupEl = document.getElementById("pickup");
    const destinationEl = document.getElementById("destination");

    if (!pickupEl || !destinationEl) return;

    const pickup = pickupEl.value.toLowerCase().trim();
    const destination = destinationEl.value.toLowerCase().trim();

    if (!pickup || !destination) {
        alert("Please enter pickup and destination");
        return;
    }

    localStorage.setItem("routeQuery", JSON.stringify({
        pickup,
        destination
    }));

    window.location.href = "./html/route_find_interface.html";
}


async function showRouteResult() {
    const query = JSON.parse(localStorage.getItem("routeQuery"));
    if (!query) return;

    const data = await loadRouteData();

    const match = data.routes.find(r =>
        r.pickup.toLowerCase() === query.pickup &&
        r.destination.toLowerCase() === query.destination
    );

    const box = document.querySelector(".find-vehicle");

    if (!match) {
        box.innerHTML = "<h3>No route found 😢</h3>";
        return;
    }

    document.getElementById("route").innerText =
        `${match.pickup} → ${match.destination}`;

    document.getElementById("time").innerText =
        `Time: ${match.time}`;

    document.getElementById("bus").innerText =
        `Bus: ${match.bus} BDT`;

    document.getElementById("cng").innerText =
        `CNG: ${match.cng} BDT`;

    document.getElementById("bike").innerText =
        `Bike: ${match.bike} BDT`;

    document.getElementById("rickshaw").innerText =
        `Rickshaw: ${match.rickshaw}`;
}


document.addEventListener("DOMContentLoaded", () => {


    if (document.getElementById("pickup")) {
        window.findRoute = findRoute;
    }

  
    if (document.querySelector(".find-vehicle")) {
        showRouteResult();
    }

});


//Made By - Partha Chanda - 1205