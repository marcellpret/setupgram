import * as Vue from "./vue.js";
import modal from "./components/modal.js";

Vue.createApp({
    data() {
        return {
            images: [],
            allTags: [],
            tags: [],
            newTags: "",
            username: "",
            title: "",
            description: "",
            file: null,
            upload: false,
            modal: false,
            selectedId: null,
            moreButton: true,
        };
    },
    mounted() {
        if (location.pathname.slice(1)) {
            this.openModal(location.pathname.slice(1));
        }

        addEventListener("popstate", () => {
            if (location.pathname.slice(1)) {
                this.openModal(location.pathname.slice(1));
            } else {
                this.closeModal();
            }
        });

        fetch("/images")
            .then((response) => response.json())
            .then(({ rows }) => {
                console.log("rows: ", rows);
                this.images = rows;
            })
            .catch((err) => console.log(err));

        fetch("/tags")
            .then((response) => response.json())
            .then((allTags) => {
                this.allTags = allTags;
                this.tags = allTags;
            })
            .catch((err) => console.log(err));

        addEventListener("keyup", (e) => {
            if (e.key === "Escape") {
                if (this.upload) {
                    this.upload = false;
                } else if (this.modal) {
                    this.closeModal();
                } else {
                    return;
                }
            }
        });
    },
    components: {
        modal: modal,
    },
    methods: {
        clickHandler: function (e) {
            fetch("/upload", {
                method: "POST",
                body: new FormData(e.target),
            })
                .then((res) => res.json())
                .then(({ rows }) => {
                    this.images.unshift(rows[0]);
                })
                .catch((err) => {
                    console.log("error submitting form fields: ", err);
                });
            this.upload = !this.upload;
            this.description = "";
            this.title = "";
        },
        fileSelectHandler: function (e) {
            this.file = e.target.files[0];
        },
        toggleUploader: function () {
            this.upload = !this.upload;
        },
        closeUploader: function () {
            this.upload = false;
        },
        openModal: function (imageId) {
            console.log(imageId);
            this.modal = true;
            this.selectedId = imageId;
            history.pushState({}, "", `${imageId}`);
        },
        closeModal: function () {
            this.modal = false;
            history.pushState({}, "", "/");
        },
        getMoreImages: function () {
            let lowestId = this.images[this.images.length - 1].id;

            fetch(`/more-images/${lowestId}`)
                .then((response) => response.json())
                .then(({ rows }) => {
                    this.images.push(...rows);
                    if (
                        rows[rows.length - 1].id ==
                        rows[rows.length - 1].lowestId
                    ) {
                        this.moreButton = false;
                    }
                })
                .catch((err) => console.log(err));
        },
        filterByTag: function (tag) {
            // let lowestId = this.images[this.images.length - 1].id;
            console.log(tag);
            fetch(`/filter-by-tag/${tag}`)
                .then((response) => response.json())
                .then(({ rows }) => {
                    this.images = rows;
                    this.tags = [tag];
                })
                .catch((err) => console.log(err));
        },
        clearFilterByTag: function () {
            // let lowestId = this.images[this.images.length - 1].id;
            fetch("/images")
                .then((response) => response.json())
                .then(({ rows }) => {
                    console.log("rows: ", rows);
                    this.images = rows;
                    this.tags = this.allTags;
                })
                .catch((err) => console.log(err));
        },
    },
}).mount("#main");
