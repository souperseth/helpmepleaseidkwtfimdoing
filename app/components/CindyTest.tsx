import { useEffect, useState } from "react";

export function CindyTest() {
	const [cindy, setCindy] = useState();

	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://cindyjs.org/dist/latest/Cindy.js";
		script.type = "text/javascript";
		script.async = true;
		document.body.appendChild(script);
		const script2 = document.createElement("script");
		script2.src = "https://cindyjs.org/dist/latest/CindyGL.js";
		script2.type = "text/javascript";
		script2.async = true;
		document.body.appendChild(script2);
		console.log(script);
		console.log(script2);
		return () => {
			juliaCindy();
			document.body.removeChild(script);
			document.body.removeChild(script2);
		};
	}, []);

	function juliaCindy() {
		const gslp: any = [];
		window.CindyJS &&
			setCindy(
				window.CindyJS({
					scripts: "cs*",
					geometry: gslp,
					animation: { autoplay: true },
					ports: [
						{
							id: "JuliaCanvas",
							width: "500px",
							height: "500px",
							transform: [
								{ visibleRect: [-1.5, -1.5, 1.5, 1.5] },
							],
						},
					],
				})
			);
		cindy && cindy.startup();

		var cdy = window.CindyJS({
			scripts: {
				init: `
				polar(alpha) := (cos(alpha),sin(alpha));

				anglemark(P, degstart, degend, r, line, fillcolor, fillalpha) := (
					// degstart can be number or number°, convert - https://github.com/CindyJS/CindyJS/issues/801

					zA = P + polar(degstart);
					zB = P + polar(degend);
					d = det(P,zA,zB);
					shape = if(
						d~=0,
						halfplane(join(P,zA), P+[ [0,-1], [1,0] ]*(zA-P)),
						if(
							d>0,
							halfplane(join(P,zA),zB)~~halfplane(join(P,zB),zA),
							screen()--(halfplane(join(P,zA),zB)~~halfplane(join(P,zB),zA))
						)
					)~~circle(P,r);
					fill(shape, alpha->fillalpha, color->fillcolor);
					if(line, draw(shape));
				);

				getrotation(rpA, rpB, rpC) := (
					rotangle = 0;
					
					// get orientation
					if(rpB.y < rpC.y, 
							
					);
					rotangle;
				);

				linea = 0;
				lineb = 0;
				linec = 0;

				anglea = 50°;
				angleb = 50°;
				anglec = 80°;
				angler = 0.7;
				anglepos = (4,4);

				circumference = 0;

				// colors
				cblack = (0.1,0.1,0.1);
				cblue = (0.1,0.1,1.0);
				cred = (1.0,0.1,0.1);
				cgreen = (0.1,1.0,0.1);
				cbluelight = (0.4,0.4,1.0);
				credlight = (1.0,0.4,0.4);
				cgreenlight = (0.4,1.0,0.4);
				`,
				draw: `
					// calculate length of all lines via Pythagoras
					linec = sqrt( pow(B.x-A.x, 2) + pow(B.y-A.y, 2) ); // lineAB
					linea = sqrt( pow(C.x-B.x, 2) + pow(C.y-B.y, 2) ); // lineBC
					lineb = sqrt( pow(C.x-A.x, 2) + pow(C.y-A.y, 2) ); // lineAC
					// print(lineAB+" / "+lineBC+" / "+lineAC);

					circumference = linea + lineb + linec;

					// calculate angles via Kosinussatz
					anglea = arccos( (-pow(linea,2) + pow(lineb,2) + pow(linec,2)) / ( 2*lineb*linec ) );
					angleb = arccos( (-pow(lineb,2) + pow(linea,2) + pow(linec,2)) / ( 2*linea*linec ) );
					anglec = arccos( (-pow(linec,2) + pow(linea,2) + pow(lineb,2)) / ( 2*linea*lineb ) );

					// calculate area
					flache = (A.x * B.y - B.x * A.y) + (B.x * C.y - C.x * B.y) + (C.x * A.y - A.x * C.y);

					// calculate centroid
					centroid = [ (A.x+B.x+C.x)/3, (A.y+B.y+C.y)/3];


					// top right angle set
					anglemark(anglepos, 0, anglea, angler, true, cbluelight, 1);
					anglemark(anglepos, anglea, anglea+angleb, angler, true, credlight, 1);
					anglemark(anglepos, anglea+angleb, anglea+angleb+anglec, angler, true, cgreenlight, 1);
					// print(anglea+" / "+angleb+" / "+anglec);
						
					// draw triangle lines
					draw([A,B], color->cblue, size->2);
					draw([B,C], color->cgreen, size->2);
					draw([A,C], color->cred, size->2);

					// drawpoly( [A,B,C], color->(0,0,1), size->2);
					// fillpoly( [A,B,C], color->(0,0,1), alpha->0.5);

					// draw angles in triangle
					// lineABc = sqrt( pow(B.x-A.x,2) + pow(A.y-B.y,2) );
					// startangleA = arccos( (-pow(A.y-B.y,2) + pow(B.x-A.x,2) + pow(lineABc,2)) / ( 2*(B.x-A.x)*lineABc ) );
					startangleA = getrotation(A, B, C);
					startangleB = 0;
					startangleC = 0;

					// anglemark(A, -startangleA, anglea-startangleA, angler, true, cgreenlight, 1);
					// --- hier beginnt der Code für alpha
					unit(v) := (v.x/sqrt(v.x*v.x+v.y*v.y),v.y/sqrt(v.x*v.x+v.y*v.y));
					fillarc(A+unit(B-A)*angler,A+angler*unit(C+B-2*A),A+angler*unit(C-A),color->cgreenlight);
					fillpoly([A,A+unit(B-A)*angler,A+angler*unit(C-A)],color->cgreenlight);
					// --- <fini>

					anglemark(B, startangleB, angleb, angler, true, credlight, 1);
					anglemark(C, startangleC, anglec, angler, true, cbluelight, 1);

					`,
			},

			geometry: [
				{
					name: "A",
					kind: "P",
					type: "Free",
					pos: [1, 2],
					color: [0, 0, 0],
					labeled: true,
					size: 3,
				},
				{
					name: "B",
					kind: "P",
					type: "Free",
					pos: [4, 2],
					color: [0, 0, 0],
					labeled: true,
					size: 3,
				},
				{
					name: "C",
					kind: "P",
					type: "Free",
					pos: [2, 4],
					color: [0, 0, 0],
					labeled: true,
					size: 3,
				},
			],

			ports: [
				{
					id: "cscanvas-beliebiges-dreieck",
					axes: false,
					width: 500,
					height: 500,
					transform: [
						{
							visibleRect: [-0.5, 5.0, 5.0, -0.5],
						},
					],
					grid: 0,
					// snap: true,
				},
			],
			csconsole: null,
			autoplay: false,
		});

		return cindy;
	}

	function julia() {
		return (
			<div>
				<script id="csinit" type="text/x-cindyscript">
					{`f(z, c) := z*z+c;
            		createimage("julia", 500, 500);`}
				</script>
				<script id="csdraw" type="text/x-cindyscript">
					{`c = complex(mouse());
					color(z) := (
					z = f(z, c);
					if(abs(z)<1.5,
						imagergb("julia", z) + 0.01*(1,2,3),
						(0,0,0)
					)
					);
					colorplot("julia", (color(complex(#))));
					drawimage([-1.5,-1.5], [1.5,-1.5], "julia");`}
				</script>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center pt-16 pb-4">
			Cindy Test - Julia Set
			<div id="JuliaCanvas" className="w-200 h-200"></div>
			{julia()}
			<div id="cscanvas-beliebiges-dreieck"></div>
		</div>
	);
}
