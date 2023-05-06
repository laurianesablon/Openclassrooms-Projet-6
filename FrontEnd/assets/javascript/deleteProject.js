function deleteProject(id) {
    fetch("http://localhost:5678/api/works/" + id, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        let figure_gallery = document.querySelector("#work-" + id);
        console.log(figure_gallery);
        if (figure_gallery) {
          figure_gallery.remove();
        }
      })
      .catch((err) => console.log("Il y a un problème : " + err));
  }