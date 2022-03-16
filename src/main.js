let map = create_map();
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
let camx = -100, camy = -66;
let curx = -1, cury = -1;
let rmb_down = false;
let panning = false;
let panstart_x = 0;
let panstart_y = 0;
let cur_player = create_player(1);
let other_player = create_player(2);

let selected = null;

(async function main() {

	let imgs = {
		terra: await load_image("gfx/terra.png"),
		obj: await load_image("gfx/obj.png"),
		building: await load_image("gfx/building.png"),
		fence: await load_image("gfx/fence.png"),
		ware: await load_image("gfx/ware.png"),
		settler: await load_image("gfx/settler.png"),
	};
	
	create_tower(imgs, cur_player).put(5,5);
	create_tower(imgs, other_player).put(2,0);
	create_tower(imgs, cur_player).put(10,13);
	create_settler(imgs, cur_player).put(11,13);
	
	let wood = create_obj(imgs, "axe").put(12,12);
	
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
			panstart_x = e.clientX;
			panstart_y = e.clientY;
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
		let dist = (panstart_x - e.clientX)**2 + (panstart_y - e.clientY)**2;
		
		if(rmb_down && panning === false && dist >= 16**2) {
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
		if(
			canvas.width !== canvas.clientWidth ||
			canvas.height !== canvas.clientHeight
		) {
			canvas.width = canvas.clientWidth;
			canvas.height = canvas.clientHeight;
		}
		
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
