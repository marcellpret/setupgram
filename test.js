const tags = [
    { tags: ["simple", "clear"] },
    { tags: ["minimal", "simple", "colors"] },
    { tags: ["simple"] },
    { tags: ["unique"] },
    { tags: ["colors", "clear"] },
    { tags: ["simple", "clear", "minimal"] },
];

let allTags = tags.flatMap((item) => item.tags);

// tags.forEach((item) => {
//     allTags += item.tags;
// });

// allTags = allTags
//     .split("#")
//     .map((item) => {
//         return item.trim();
//     })
//     .filter((item) => item);

console.log("allTags: ", [...new Set(allTags)]);
