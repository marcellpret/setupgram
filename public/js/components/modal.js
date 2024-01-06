import comments from "./comments.js";

const modal = {
    data() {
        return {
            image: {},
            width: "1px",
        };
    },
    props: ["id"],
    watch: {
        id() {
            this.getImageInfo();
        },
    },
    mounted() {
        this.getImageInfo();
        addEventListener("keyup", this.getArrows);
    },

    beforeUnmount() {
        console.log("unmount");
        removeEventListener("keyup", this.getArrows);
    },

    components: {
        comments: comments,
    },
    emits: ["close", "change-id"],
    methods: {
        getImageInfo: function () {
            fetch(`/images/${this.id}`)
                .then((response) => response.json())
                .then(({ rows }) => {
                    console.log("rows: ", rows);

                    this.image = rows[0];
                });
        },
        close: function () {
            this.$emit("close");
        },
        changeId: function (newId) {
            console.log(newId);
            this.$emit("change-id", newId);
        },
        getArrows: function (e) {
            if (e.key === "ArrowLeft") {
                if (!this.image.previousImg) {
                    return;
                }
                this.changeId(this.image.previousImg);
                return;
            }
            if (e.key === "ArrowRight") {
                if (!this.image.nextImg) {
                    return;
                }
                this.changeId(this.image.nextImg);
                return;
            }
        },
    },
    template: `

    <div class="backdrop">
        <div class="modal">
            <div @click="close" class="close">
                <span class="material-icons">close</span>
            </div>
            <img :src=image.url  :alt=image.description srcset="">
            <div class="info">
            <div class="info-details">
                <h3>
                <span class="material-icons">person</span>{{image.username}}
                </h3>
                <hr>
                <h4>{{image.title}}</h4>
                <hr>
                <p>{{image.description}}</p>
            </div>
                <comments :imageId="this.id"></comments>
            </div>
            <div v-if='image.previousImg' @click="changeId(image.previousImg)" class="previous">&lt;</div>
            <div v-if='image.nextImg' @click="changeId(image.nextImg)" class="next">&gt;</div>
        </div>
    </div>
    `,
};
export default modal;
