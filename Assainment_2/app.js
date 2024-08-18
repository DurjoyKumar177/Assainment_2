document.addEventListener('DOMContentLoaded', function() {
    
    fetchPlayers('');

    // Search using button click
    document.getElementById('searchButton').addEventListener('click', function() {
        let query = document.getElementById('searchInput').value.trim();
        fetchPlayers(query);
    });

    // Search using enter key
    document.getElementById('searchInput').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            let query = this.value.trim();
            fetchPlayers(query);
        }
    });
});

let team = [];

function fetchPlayers(query) {
    
    let url;

if (query.length > 0) {
    url = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${query}`;
} 

else {
    url = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=a`;
}


    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.player) {
                displayPlayers(data.player);
            } 
            
            else {
                document.getElementById('playerList').innerHTML = '<p>No players found</p>';
            }
        });
}

function displayPlayers(players) {
    players.sort((a, b) => a.strPlayer.localeCompare(b.strPlayer));

    let playerList = document.getElementById('playerList');
    playerList.innerHTML = '';

    players.forEach(player => {
        let card = document.createElement('div');
        card.className = 'col-md-4 mb-3';
        
        //social media links
        let twitter = player.strTwitter ? `https://${player.strTwitter}` : '#';
        let instagram = player.strInstagram ? `https://${player.strInstagram}` : '#';
        
        card.innerHTML = `
            <div class="card">
                <img src="${player.strThumb}" class="card-img-top" alt="${player.strPlayer}">
                <div class="card-body">
                    <h5 class="card-title">${player.strPlayer}</h5>
                    <p class="card-text">Nationality: ${player.strNationality}</p>
                    <p class="card-text">Team: ${player.strTeam}</p>
                    <p class="card-text">Sport: ${player.strSport}</p>
                    <div class="social-media">
                        <a href="${twitter}" target="_blank" class="btn btn-outline-primary">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <a href="${instagram}" target="_blank" class="btn btn-outline-danger">
                            <i class="fab fa-instagram"></i>
                        </a>
                    </div>
                    <button class="btn btn-primary mt-2" onclick="showPlayerDetails(${player.idPlayer})">Details</button>
                    <button class="btn btn-success mt-2" onclick="addToTeam('${player.strPlayer}', '${player.strSport}')">Add to Team</button>
                </div>
            </div>
        `;
        playerList.appendChild(card);
    });
}

function showPlayerDetails(id) {
    fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${id}`)
        .then(response => response.json())
        .then(data => {
            let player = data.players[0];
            document.querySelector('.modal-body').innerHTML = `
                <p>Name: ${player.strPlayer}</p>
                <p>Gender: ${player.strGender}</p>
                <p>Height: ${player.strHeight}</p>
                <p>Weight: ${player.strWeight}</p>
                <p>Date of Birth: ${player.dateBorn}</p>
                <p>Birth Location: ${player.strBirthLocation}</p>
                <p>Description: ${player.strDescriptionEN 
                    ? player.strDescriptionEN.substring(0, 150) + '...' 
                     : 'No description available'}</p>`;
            let modal = new bootstrap.Modal(document.getElementById('playerModal'));
            modal.show();
        });
}

function addToTeam(name, sport) {
    // Check if player already exists in the team
    if (team.some(player => player.name === name)) {
        alert("This player is already in your team.");
        return;
    }

    if (team.length >= 11) {
        alert("You cannot add more than 11 players.");
        return;
    }

    team.push({ name, sport });
    updateTeamList();
}

function updateTeamList() {
    let teamList = document.getElementById('teamList');
    teamList.innerHTML = '';

    team.forEach((player, index) => {
        let listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.innerHTML = `${index + 1}. ${player.name} (${player.sport}) 
                              <button class="btn btn-danger btn-sm" onclick="removeFromTeam(${index})">Remove</button>`;
        teamList.appendChild(listItem);
    });
}

function removeFromTeam(index) {
    team.splice(index, 1); // index= position and 1 is amount in splice event
    updateTeamList();
}
