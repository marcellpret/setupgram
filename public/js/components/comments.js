const comments = {
    data() {
        return {
            username: "",
            comment: "",
            comments: [],
        };
    },
    props: ["imageId"],
    watch: {
        imageId: function () {
            fetch(`/comments/${this.imageId}`)
                .then((response) => response.json())
                .then(({ rows }) => {
                    console.log("rows in comments: ", rows);

                    this.comments = rows;
                })
                .catch((err) => console.log(err));
        },
    },
    mounted() {
        console.log("Image Id in components: ", this.imageId);

        fetch(`/comments/${this.imageId}`)
            .then((response) => response.json())
            .then(({ rows }) => {
                console.log("rows in comments: ", rows);

                this.comments = rows;
            })
            .catch((err) => console.log(err));
    },
    methods: {
        clickHandler: function () {
            fetch("/upload/comment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: this.username,
                    comment: this.comment,
                    imageId: this.imageId,
                }),
            })
                .then((res) => res.json())
                .then(({ rows }) => {
                    console.log("rows: ", rows);

                    this.comments.unshift(rows[0]);
                })
                .catch((err) => {
                    console.log(
                        "error submitting form fields in comments: ",
                        err
                    );
                });

            this.comment = "";
            // this.username = "";
        },
    },
    template: `
    <div className="comments">
        <form>
            <input v-model="username" type="text" name="username" placeholder="username" />
            <textarea v-model="comment" rows="3" name="comment" placeholder="Leave your comment"></textarea>
            <button @click.prevent="clickHandler">Submit</button>
        </form>
        <h3 v-if="this.comments.length">Comments</h3>
        <div class="comment" v-for="comment in comments">
            <p><em>by {{comment.username}}</em></p>   
            <q>{{comment.comment}}</q>   
        </div>
    </div>
    
    `,
};

export default comments;
