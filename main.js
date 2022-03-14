let cur_player = 1;
let map = create_map();
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
let camx = -100, camy = -66;
let curx = -1, cury = -1;
let panning = false;
let player = create_player(1);

(async function main() {

	let imgs = {
		terra: await load_image("terra.png"),
		obj: await load_image("obj.png"),
		fence: await load_image("fence.png"),
	};
	
	create_tower(1).put(5,5);
	create_tower(2).put(2,0);
	create_tower(1).put(10,13);
	create_settler(player).put(11,13);
	
	onmousedown = e => {
		if(e.button === 2) {
			panning = true;
			canvas.requestPointerLock();
		}
	};
	
	onmouseup = e => {
		panning = false;
		document.exitPointerLock();
	};
	
	onmousemove = e => {
		if(panning) {
			camx += e.movementX;
			camy += e.movementY;
		}
		else {
			let rect = canvas.getBoundingClientRect();
			curx = Math.floor((e.clientX - rect.left + camx) / 32);
			cury = Math.floor((e.clientY - rect.top + camy) / 32);
		}
	};
	
	oncontextmenu = e => {
		e.preventDefault();
	};
	
	requestAnimationFrame(function frame() {
		requestAnimationFrame(frame);
		update();
		render();
	});
	
	function update()
	{
		player.settlers.forEach(settler => {
			settler.update();
		});
	}
	
	function render()
	{
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, 800, 600);
		map.draw(imgs);
	}
})();

function load_image(url)
{
	return new Promise((res, rej) => {
		let img = document.createElement("img");
		img.src = url;
		img.onload = () => res(img);
	});
}
