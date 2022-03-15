
let settler_proto = create_obj("settler");

Object.assign(settler_proto, {
	way: 0,
	fx: 0,
	fy: 0,
	path: [],
	
	goto(x, y)
	{
		let path = map.get_path(this.player, [this.x, this.y], [x, y]);
		
		if(path && path.length) {
			this.path = path;
		}
	},
	
	update()
	{
		if(this.way == 0) {
			if(this.path.length) {
				let [tox, toy] = this.path.shift();
				this.way = 1;
				this.fx = this.x;
				this.fy = this.y;
				this.put(tox, toy);
				
				this.framex = (
					tox > this.fx ? 1 : tox < this.fx ? 2 :
					toy > this.fy ? 0 : toy < this.fy ? 3 : 0
				);
			}
		}
		
		if(this.way > 0) {
			this.way -= 0.04;
			this.dx = (this.fx - this.x) * 32 * this.way;
			this.dy = (this.fy - this.y) * 32 * this.way;
			
			if(this.way <= 0) {
				this.way = 0;
			}
		}
	},
});

function create_settler(player)
{
	let settler = Object.create(settler_proto);
	settler.player = player;
	player.settlers.push(settler);
	return settler;
}
