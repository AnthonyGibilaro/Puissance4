export class Jeu {
  constructor(element, x = 7, y = 6, couleur1 = "#ff0000", couleur2 = "#ffff00") {
    this.element = element;
    this.x = x;
    this.y = y;
    this.couleur1 = couleur1;
    this.couleur2 = couleur2;
    this.coupsJoues = [];
    this.scores = [0, 0];
    this.nombre_joueur = Math.floor(Math.random() * 2);
    this.grille = new Grille(element, x, y);
    this.fini = false;
    this.annulerTour = false;
    this.formulaire();
  }
  createLabel(html, textcontent) {
    let label = document.createElement("label");
    label.htmlFor = html;
    label.textContent = textcontent;
    return label;
  }
  createInput(type, id, name, required, min, max, value) {
    let input = document.createElement("input");
    input.type = type;
    input.id = id;
    input.name = name;
    input.required = required;
    input.min = min;
    input.max = max;
    input.value = value;
    return input;
  }
  formulaire() {
    const formulaire = document.createElement("div");
    formulaire.className = "formulaire";
    const form = document.createElement("form");

    const h1 = document.createElement("h1");
    h1.textContent = "Puissance 4";
    form.appendChild(h1);

    const div1 = document.createElement("div");
    div1.className = "divForm";
    form.appendChild(div1);
    const label1 = this.createLabel('name1', 'Nom joueur 1 : ');
    div1.appendChild(label1);
    this.input1 = this.createInput('text', 'name1', 'nom1', true);
    div1.appendChild(this.input1);
    const label2 = this.createLabel('joueur1', 'Couleur : ');
    div1.appendChild(label2);
    this.input2 = this.createInput('color', 'joueur1', 'joueur1', true);
    div1.appendChild(this.input2);

    const div2 = document.createElement("div");
    div2.className = "divForm";
    form.appendChild(div2);
    const label3 = this.createLabel('name2', 'Nom joueur 2 : ');
    div2.appendChild(label3);
    this.input3 = this.createInput('text', 'name2', 'nom2', true);
    div2.appendChild(this.input3);
    const label4 = this.createLabel('joueur2', 'Couleur : ');
    div2.appendChild(label4);
    this.input4 = this.createInput('color', 'joueur2', 'joueur2', true);
    div2.appendChild(this.input4);

    const div3 = document.createElement("div");
    div3.className = "divForm2";
    form.appendChild(div3);
    const label5 = this.createLabel('x', 'Largeur : ');
    div3.appendChild(label5);
    this.input5 = this.createInput('number', 'x', 'x', true, 4, 16, this.x);
    div3.appendChild(this.input5);
    const label6 = this.createLabel('y', 'Hauteur : ');
    div3.appendChild(label6);
    this.input6 = this.createInput('number', 'y', 'y', true, 4, 16, this.y);
    div3.appendChild(this.input6);

    const div4 = document.createElement("div");
    div4.className = "divForm";
    form.appendChild(div4);
    const button = document.createElement("button");
    button.type = "submit";
    button.textContent = "Démarrer la partie";
    div4.appendChild(button);

    formulaire.appendChild(form);
    this.element.insertBefore(formulaire, this.element.firstChild);

    this.input5.addEventListener('change', (e) => {
      this.x = this.input5.value;
      this.grille = new Grille(this.element, this.x, this.y);
    });

    this.input6.addEventListener('change', (e) => {
      this.y = this.input6.value;
      this.grille = new Grille(this.element, this.x, this.y);
    });

    this.input2.value = this.couleur1;
    this.input1.value = "Joueur 1";
    this.input4.value = this.couleur2;
    this.input3.value = "Joueur 2";

    this.input2.addEventListener('change', (e) => {
      document.documentElement.style.setProperty('--couleur-joueur1', this.input2.value);
    });
    this.input4.addEventListener('change', (e) => {
      document.documentElement.style.setProperty('--couleur-joueur2', this.input4.value);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.input1.value === this.input3.value) {
        alert("Les deux joueurs ne peuvent pas avoir le même nom !");
        return;
      }
      if (this.input2.value === this.input4.value) {
        alert("Les deux joueurs ne peuvent pas avoir la même couleur !");
        return;
      }

      formulaire.remove();
      this.joueurs = [new Joueur(this.input1.value), new Joueur(this.input3.value)];
      this.afficherPlateau();
    });
  }

  afficherPlateau() {
    this.grille.element.innerHTML = "";
    const table = document.createElement("table");
    for (let i = 0; i < this.y; i++) {
      const row = document.createElement("tr");
      for (let j = 0; j < this.x; j++) {
        const pion = document.createElement("td");
        pion.addEventListener("click", () => this.placerPion(j));
        if (this.grille.tableau[i][j].getStatus() === 1) {
          pion.classList.add("joueur1");
        }
        if (this.grille.tableau[i][j].getStatus() === 2) {
          pion.classList.add("joueur2")
        }

        if (this.pionsGagnants) {
          this.pionsGagnants.forEach(pionGagnant => {
            if (j === pionGagnant.x && i === pionGagnant.y) {
              pion.classList.add('victory');
            }
          });
        }

        row.appendChild(pion);
      }
      table.appendChild(row);
    }
    this.tour = document.createElement("div");
    this.tour.className = "tour";
    this.joueur_actuel = this.joueurs[this.nombre_joueur];
    console.log(this.joueur_actuel);
    this.tour.textContent = 'Au tour de ' + this.joueur_actuel.getNom();
    const recommencerBtn = document.createElement("button");
    recommencerBtn.className = "restart";
    recommencerBtn.textContent = "Recommencer la partie";
    recommencerBtn.addEventListener("click", () => this.recommencerPartie());

    this.span1 = document.createElement("span");
    this.span1.className = "scoreJoueur1";
    this.span1.textContent = this.scores[0];

    this.span2 = document.createElement("span");
    this.span2.className = "scoreJoueur2";
    this.span2.textContent = this.scores[1];
    const textScore = document.createElement("p");
    textScore.className = "textScore";
    this.tiret = document.createElement("span");
    this.tiret.textContent = "-";
    textScore.appendChild(this.span1);
    textScore.appendChild(this.tiret);
    textScore.appendChild(this.span2);

    this.grille.element.appendChild(textScore);
    this.grille.element.appendChild(table);
    this.grille.element.appendChild(this.tour);
    this.grille.element.appendChild(recommencerBtn);

    if (this.annulerTour) {
      this.annulerBtn = document.createElement("button");
      this.annulerBtn.className = "undo";
      this.annulerBtn.textContent = "Annuler le dernier coup";
      this.annulerBtn.addEventListener("click", () => this.annulerCoup());
      this.grille.element.appendChild(this.annulerBtn);
    }
  }

  placerPion(colonne) {
    if (this.fini) {
      return;
    }
    for (let i = this.y - 1; i >= 0; i--) {
      if (this.grille.tableau[i][colonne].getStatus() === 0) {
        const joueur = this.joueurs[this.nombre_joueur];
        this.grille.tableau[i][colonne].setStatus(this.nombre_joueur + 1);
        this.annulerTour = true;
        this.nombre_joueur = (this.nombre_joueur + 1) % this.joueurs.length;
        const gagnant = this.victoire();
        if (gagnant !== 0) {
          setTimeout(function () {
            alert(joueur.getNom() + ' a gagné !');
          }, 100);
          this.fini = true;
          this.scores[gagnant - 1]++;
          this.span1.textContent = this.scores[0];
          this.span2.textContent = this.scores[1];
        }
        else {
          if (this.nulle()) {
            setTimeout(function () {
              alert('Match nul !');
            }, 100);
            this.fini = true;
          }
        }
        this.coupsJoues.push({ colonne: colonne, ligne: i });
        break;
      }
    }
    this.afficherPlateau();
  }

  annulerCoup() {
    if (this.fini) {
      return;
    }
    if (this.coupsJoues.length > 0) {
      const dernierCoup = this.coupsJoues.pop();
      const colonne = dernierCoup.colonne;
      const ligne = dernierCoup.ligne;
      this.grille.tableau[ligne][colonne].setStatus(0);
      this.nombre_joueur = (this.nombre_joueur - 1 + this.joueurs.length) % this.joueurs.length;
      this.joueur_actuel = this.joueurs[this.nombre_joueur];
      this.tour.textContent = 'Au tour de ' + this.joueur_actuel.getNom();
      this.annulerTour = false;
      this.afficherPlateau();
    }
  }

  victoire() {
    const directions = [
      { x: 0, y: 1 }, // vers la droite
      { x: 1, y: 0 }, // vers le bas
      { x: 1, y: 1 }, // vers la diagonale bas-droite
      { x: 1, y: -1 } // vers la diagonale haut-droite
    ];

    for (let i = 0; i < this.grille.x; i++) {

      for (let j = 0; j < this.grille.y; j++) {
        const pion = this.grille.tableau[j][i];
        if (pion.getStatus() !== 0) {
          for (let k = 0; k < directions.length; k++) {
            const direction = directions[k];
            let count = 1;
            let x = i + direction.x;
            let y = j + direction.y;
            while (x >= 0 && x < this.grille.x && y >= 0 && y < this.grille.y && this.grille.tableau[y][x].getStatus() === pion.getStatus()) {
              count++;
              x += direction.x;
              y += direction.y;
            }
            if (count >= 4) {
              x -= direction.x;
              y -= direction.y;
              console.log("j'ai gagné en ", x, y);
              console.log("direction = ", direction);

              let pionGagnant1 = { x: x, y: y };
              let pionGagnant2 = { x: x - direction.x, y: y - direction.y };
              let pionGagnant3 = { x: x - direction.x * 2, y: y - direction.y * 2 };
              let pionGagnant4 = { x: x - direction.x * 3, y: y - direction.y * 3 };
              this.pionsGagnants = [pionGagnant1, pionGagnant2, pionGagnant3, pionGagnant4];

              return pion.getStatus();
            }
          }
        }
      }
    }
    return 0;
  }

  nulle() {
    for (let i = 0; i < this.y; i++) {
      for (let j = 0; j < this.x; j++) {
        if (this.grille.tableau[i][j].getStatus() === 0) {
          return false;
        }
      }
    }
    return true;
  }

  recommencerPartie() {
    for (let i = 0; i < this.y; i++) {
      for (let j = 0; j < this.x; j++) {
        this.grille.tableau[i][j].setStatus(0);
      }
    }
    this.annulerBtn.style.display = "none";
    this.coupsJoues = [];
    this.pionsGagnants = undefined;
    this.nombre_joueur = Math.floor(Math.random() * 2);
    this.joueur_actuel = this.joueurs[this.nombre_joueur];
    this.tour.textContent = 'Au tour de ' + this.joueur_actuel.getNom();
    this.fini = false;
    this.afficherPlateau();
  }
}
class Grille {
  constructor(parentElement, x, y) {
    let gridContainer = document.getElementById('grid-container');
    if (gridContainer) {
      gridContainer.remove();
    }
    this.element = document.createElement('div');
    this.element.id = "grid-container";
    parentElement.appendChild(this.element);
    this.x = x;
    this.y = y;
    this.tableau = [];
    for (let i = 0; i < this.y; i++) {
      this.tableau[i] = [];
      for (let j = 0; j < this.x; j++) {
        this.tableau[i][j] = new Pion();
      }
    }
  }

}
class Pion {
  #status = 0;
  getStatus() {
    return this.#status;
  }
  setStatus(status) {
    status !== 0 && status !== 1 && status !== 2;
    this.#status = status;
  }
}
class Joueur {
  #nom;
  constructor(nom) {
    this.#nom = nom;
  }
  getNom() {
    return this.#nom;
  }
}
