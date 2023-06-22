gallery = document.querySelector(".gallery");
token = localStorage.token;
let objets = document.querySelector(".objets");
let apparts = document.querySelector(".appart");
let hotel = document.querySelector(".hotel");
let tous = document.querySelector(".tous");
let select_category_options = document.getElementById("input_category");
let loader = document.querySelector(".loader");

window.addEventListener("load", () => {
  getCategories().then((data) => {
    data.forEach((categorie) => {
      let option = document.createElement("option");
      option.value = categorie.id;
      option.text = categorie.name;
      select_category_options.add(option);
    });
  });
});

//Affiche les images de la galerie
function afficherImages(filtre) {
  // Clear the gallery before appending new images
  gallery.innerHTML = "";
  for (let i = 0; i < filtre.length; i++) {
    let figure = document.createElement("figure");
    let img = document.createElement("img");
    let figcaption = document.createElement("figcaption");
    img.src = filtre[i].imageUrl;
    img.alt = filtre[i].title;
    figcaption.textContent = filtre[i].title;
    figure.id = "work-" + filtre[i].id;
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  }
}

getWorks().then((works) => {
  afficherImages(works);
  Filtres(works);
});

let authentified = localStorage.token;
//gerer la page lorsque connecté
if (authentified !== undefined) {
  let filtres = document.querySelector(".filtres");
  let modifierP = document.querySelector(".modifier_portfolio");
  let fileInput = document.querySelector("#introduction_img");
  let profilePicForm = document.getElementById("profileForm");

  

  modifierP.classList.remove("remove");

  //retirer les bouttons filtres
  filtres.remove();

  // changer le lien login en logout
  let link_login = document.querySelector(".link_login");
  link_login.textContent = "logout";
  link_login.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.clear();
    //window.location.reload();
  });
  //afficher la modale lorsque je clique sur modifier
  modifierP.addEventListener("click", () => {
    let modale = document.querySelector(".modale");
    let modale_form = document.querySelector(".modale_form_container");
    let modale_start = document.querySelector(".modale_start");
    let modale_supprimer_gallerie = document.querySelector(".modale_supprimer");
    //modale_supprimer_gallerie.close();
    modale.showModal();
    modale_form.remove();
    let modale_images = document.querySelector(".modale_images");
    getWorks().then((works) => {
      for (let i = 0; i < works.length; i++) {
        let figure = document.createElement("figure");
        let img = document.createElement("img");
        let trash = document.createElement("img");
        img.src = works[i].imageUrl;
        img.classList.add("modale_image");
        figure.appendChild(img);
        //bouton poubelle (delete)
        trash.src = "./assets/icons/trash.svg";
        trash.classList.add("modale_image_trash");

        trash.addEventListener("click", () => {
          deleteProject(works[i].id);
          // Remove the work from the DOM
          modale_images.removeChild(figure);
        });
        modale_images.appendChild(figure);
        figure.appendChild(trash);
      }
      //supprimer la galerie
      let supprimer = document.querySelector(".supprimer");
      let bouton_oui = document.querySelector("#oui");
      let bouton_non = document.querySelector("#non");

      supprimer.addEventListener("click", () => {
        modale_supprimer_gallerie.showModal();
        bouton_non.addEventListener("click", () => {
          modale_supprimer_gallerie.close();
        });
        bouton_oui.addEventListener("click", () => {
          let numWorks = works.length;
          let i = 0;
          loader.classList.add("remove"); // show loader
          works.forEach((work) => {
            deleteProject(work.id, () => {
              i++;
              if (i === numWorks) {
                loader.remove(); // remove loader
                modale.close();
                modale_supprimer_gallerie.close();
              }
            });
          });
        });
      });

      //icone croix
      remove_modal_icon = document.querySelector(".fa-xmark");
      remove_modal_icon.addEventListener("click", () => {
        modale_start.remove();
        modale_form.remove();

        //supprimer les photos en sortant
        modale_images.innerHTML = "";
        //window.location.reload();
      });
      let modale = document.querySelector(".modale");
      let ajout_photo = document.querySelector(".ajout_photo");

      ajout_photo.addEventListener("click", () => {
        modale_start.remove();
        modale.appendChild(modale_form);
        //fleche retour
        let fleche = document.querySelector(".fa-arrow-left");
        fleche.classList.remove("white");
        fleche.addEventListener("click", () => {
          modale_form.remove();
          modale.appendChild(modale_start);
        });
        let real_form_btn = document.querySelector("#real_image_form");
        let ajout_photo_btn = document.querySelector("#ajout_photo");
        remove_modal_icon = document.querySelector(".fa-xmark");
        remove_modal_icon.addEventListener("click", () => {
          modale.remove();
          //window.location.reload();
        });
        ajout_photo_btn.addEventListener("click", () => {
          real_form_btn.click();
        });
        // envoi du formulaire
        image_input = document.querySelector("#real_image_form");
        form_container = document.querySelector(".modale_form");
        let valider = document.querySelector(".valider");
        let image;
        let titre;
        let formData = new FormData();
        let preview = document.createElement("img");
        let format = document.getElementById("format");
        let img_container_modale = document.getElementById("modale_form_img");
        let maxSize = 4000000;

        //montrer la preview de l'image
        function showPreview(e) {
          let src = URL.createObjectURL(e.target.files[0]);
          preview.classList.add("preview");
          preview.src = src;

          format.remove();
          img_container_modale.remove();
          ajout_photo_btn.remove();
          form_container.appendChild(preview);
        }
        let erreur_taille = document.querySelector(".erreur_taille");

        real_form_btn.addEventListener("change", (e) => {
          if (e.target.files[0].size >= maxSize) {
            erreur_taille.classList.remove("remove");
            preview.remove();
          } else {
            showPreview(e);
          }
        });

        function createForm() {
          if (image.size < maxSize) {
            // Création du formulaire pour l'envoi des données
            erreur_taille.remove();

            formData.append("image", image);
            formData.append("title", titre);
            formData.append("category", option);
          }
          // Envoi des données à l'API via une requête POST
          postWorks(token, formData);
        }

        valider.addEventListener("click", (e) => {
          function envoiRequete() {
            titre = document.getElementById("input_title").value;
            image = document.getElementById("real_image_form").files[0];
            option = document.getElementById("input_category").value;

            if (
              titre &&
              image !== undefined &&
              option !== "no-option"
            ) {
              createForm();
            } else {
              let message_erreur_formulaire = document.querySelector(".message_erreur_formulaire");
              message_erreur_formulaire.classList.remove("remove");
            }
          }
          envoiRequete();
        });
      });
    });
  });
}
