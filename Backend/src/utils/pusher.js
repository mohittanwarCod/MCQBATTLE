import Pusher from "pusher";

const pusher = new Pusher({
    appId: "1824644",
    key: "fcb5051e4bb886309450",
    secret: "7e0f4281735ec7f83d1d",
    cluster: "ap2",
    useTLS: true
});


export default pusher