const tilesize = 32;
const mapsize = 16;

let cur_player = 1;
let terramap = new Uint8Array(mapsize * mapsize);
let objmap = new Array(mapsize * mapsize);
let ownmap = new Array(mapsize * mapsize);
let lightmap = new Uint8Array(mapsize * mapsize);
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
let camx = -100, camy = -66;
let curx = -1, cury = -1;
let panning = false;
let player = create_player(1);

main();

async function main()
{
	let terra_img = await load_image("terra.png");
	let obj_img = await load_image("obj.png");
	let fence_img = await load_image("fence.png");
	
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
		draw_terra();
		draw_objs();
	}
	
	function get_draw_bounds()
	{
		return {
			startx: Math.max(0, Math.floor(camx / 32) - 1),
			starty: Math.max(0, Math.floor(camy / 32)),
			endx: Math.min(mapsize - 1, Math.floor((camx + 800) / 32)),
			endy: Math.min(mapsize - 1, Math.floor((camy + 600) / 32) + 1),
		};
	}
	
	function draw_terra()
	{
		let {startx, starty, endx, endy} = get_draw_bounds();
		
		for(let y=starty; y<=endy; y++) {
			for(let x=startx; x<=endx; x++) {
				let index = x + y*mapsize;
				if(lightmap[index] == 0) continue;
				let t = terramap[index];
				let sx = t * 32;
				let sy = 0;
				
				if(lightmap[index] == 1) ctx.globalAlpha = 0.5;
				ctx.drawImage(
					terra_img,
					sx, sy, 32, 32, x * 32 - camx, y * 32 - camy, 32, 32
				);
				ctx.globalAlpha = 1;
			}
		}
	}
	
	function draw_objs()
	{
		let {startx, starty, endx, endy} = get_draw_bounds();
		
		for(let y=starty; y<=endy; y++) {
			for(let x=startx; x<=endx; x++) {
				let index = x + y*mapsize;
				if(lightmap[index] == 0) continue;
				let obj = objmap[index];
				let own = ownmap[index];
				let fence_col_offs = 0;
				
				if(curx == x && cury == y) {
					ctx.strokeStyle = "#f0f";
					ctx.strokeRect(
						curx * 32 - camx + 0.5, cury * 32 - camy + 0.5, 31, 31
					);
				}
				
				if(own > 0) {
					fence_col_offs = (own-1) * 32;
					let own_t = ownmap[index - mapsize];
					if(own_t != own) {
						ctx.drawImage(fence_img, 5 + fence_col_offs, 14, 24, 5,
						x * 32 - camx + 5, y * 32 - camy - 2, 24, 5);
					}
				}
				
				if(obj) {
					obj.draw(obj_img);
				}
				
				if(own > 0) {
					let own_l = ownmap[index - 1];
					let own_r = ownmap[index + 1];
					let own_b = ownmap[index + mapsize];
					if(own_l != own) {
						ctx.drawImage(fence_img,  + fence_col_offs, 16, 4, 26,
						x * 32 - camx, y * 32 - camy, 4, 26);
					}
					if(own_r != own) {
						ctx.drawImage(fence_img, 28 + fence_col_offs, 19, 4, 26,
						x * 32 - camx + 28, y * 32 - camy + 3, 4, 26);
					}
					if(own_b != own) {
						ctx.drawImage(fence_img, 3 + fence_col_offs, 43, 24, 5,
						x * 32 - camx + 3, y * 32 - camy + 27, 24, 5);
					}
				}
			}
		}
	}
}

function extend_prop(player, cx, cy, radius)
{
	for(let y = cy - radius; y <= cy + radius; y++) {
		if(y < 0 || y >= mapsize) continue;
		for(let x = cx - radius; x <= cx + radius; x++) {
			if(x < 0 || x >= mapsize) continue;
			let index = x + y*mapsize;
			let d = (y - cy)**2 + (x - cx)**2;
			if(d >= (radius+1)**2) continue;
			lightmap[index] |= 1;
			if(d >= radius**2) continue;
			lightmap[index] |= 2;
			if(!ownmap[index]) ownmap[index] = player;
		}
	}
}

function load_image(url)
{
	return new Promise((res, rej) => {
		let img = document.createElement("img");
		img.src = url;
		img.onload = () => res(img);
	});
}
