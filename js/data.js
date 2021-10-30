
/* ============================= LIRE LE JSON EN LOCAL ============================= */

export const getData = () => fetch('../data/FishEyeData.json')
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("HTTP error " + response.status);
            }
        })
        .catch((err) => {
            console.log("Une erreur est survenue", err)
        }
        )