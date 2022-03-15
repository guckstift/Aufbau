function estimate_dist(a, b)
{
	return Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]);
}

function find_path(start, goal, bounds, is_free_fn)
{
	let costmap = [];
	let pathmap = [];
	let frontier = [];
	
	for(let y=0; y < bounds[0]; y++) {
		costmap.push([]);
		pathmap.push([]);
	}
	
	costmap[start[0]][start[1]] = 0;
	pathmap[start[0]][start[1]] = null;
	pq_push(frontier, start, 0);
	
	while(frontier.length) {
		let cur = pq_pop(frontier);
		
		if(cur[0] === goal[0] && cur[1] === goal[1]) {
			break;
		}
		
		let adjlist = [
			[cur[0] - 1, cur[1]], [cur[0], cur[1] - 1],
			[cur[0] + 1, cur[1]], [cur[0], cur[1] + 1],
		];
		
		adjlist.forEach(adj => {
			if(is_free_fn(adj)) {
				let old_cost = costmap[adj[0]][adj[1]];
				let new_cost = costmap[cur[0]][cur[1]] + 1;
				
				if(old_cost === undefined || new_cost < old_cost) {
					let prio = new_cost + estimate_dist(adj, goal);
					pq_push(frontier, adj, prio);
					costmap[adj[0]][adj[1]] = new_cost;
					pathmap[adj[0]][adj[1]] = cur;
				}
			}
		});
	}
	
	let path = [];
	let cur = goal;
	
	while(cur[0] !== start[0] || cur[1] !== start[1]) {
		path.unshift(cur);
		cur = pathmap[cur[0]][cur[1]];
		if(cur === undefined) return;
	}
	
	return path;
}
