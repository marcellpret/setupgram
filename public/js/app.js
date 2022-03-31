import * as Vue from "./vue.js";

Vue.createApp({
    data() {
        return {
            images: [],
            username: "",
            title: "",
            description: "",
            file: null,
            upload: false,
        };
    },
    mounted() {
        fetch("/images")
            .then((response) => response.json())
            .then(({ rows }) => {
                console.log("rows: ", rows);

                this.images = rows;
            })
            .catch(console.log);
    },
    methods: {
        clickHandler: function () {
            const fd = new FormData();
            fd.append("username", this.username);
            fd.append("title", this.title);
            fd.append("description", this.description);
            fd.append("file", this.file);

            fetch("/upload", {
                method: "POST",
                body: fd,
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
        openUploader: function () {
            this.upload = !this.upload;
        },
    },
}).mount("#main");
