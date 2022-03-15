let map = create_map();
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
let camx = -100, camy = -66;
let curx = -1, cury = -1;
let rmb_down = false;
let panning = false;
let cur_player = create_player(1);
let other_player = create_player(2);

let selected = null;

(async function main() {

	let imgs = {
		terra: await load_image("terra.png"),
		obj: await load_image("obj.png"),
		fence: await load_image("fence.png"),
	};
	
	create_tower(cur_player).put(5,5);
	create_tower(other_player).put(2,0);
	create_tower(cur_player).put(10,13);
	create_settler(cur_player).put(11,13);
	
	onmousedown = e => {
		if(e.button === 0) {
			let obj = map.get_obj(curx, cury);
			
			if(obj && obj.name === "settler" && obj.player === cur_player) {
				selected = obj;
			}
			else {
				selected = null;
			}
		}
		else if(e.button === 2) {
			rmb_down = true;
		}
	};
	
	onmouseup = e => {
		if(rmb_down && panning === false && selected) {
			selected.goto(curx, cury);
		}
		
		rmb_down = false;
		panning = false;
		document.exitPointerLock();
	};
	
	onmousemove = e => {
		if(rmb_down && panning === false) {
			panning = true;
			canvas.requestPointerLock();
		}
		
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
		cur_player.settlers.forEach(settler => {
			settler.update();
		});
	}
	
	function render()
	{
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
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
