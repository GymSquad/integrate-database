const arr = [1, 2];

const main = () => {
  const promises = new Promise((resolve, reject) => {
    reject("1");
  })
    .then(
      () => "1"
      // () => "2"
    )
    .catch(() => "3")
    .then(console.log);
};

main();
