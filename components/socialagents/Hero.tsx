import Container from "../Container";
import config from "../config";

export function ArcadeEmbed() {
    return (
      <div style={{ position: 'relative', paddingBottom: 'calc(59.795918367346935% + 41px)', height: 0, width: '100%' }}>
        <iframe
          src="https://demo.arcade.software/XO3uqxWIcIUXFNMd5mPF?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true"
          title="Composition Labs"
          frameBorder="0"
          loading="lazy"
          allowFullScreen
          allow="clipboard-write"
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            colorScheme: 'light',
            padding: '0 0',
            margin: '0 0',
            // boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
          }}
        />
      </div>
    )
  }
  

export default function Hero() {
	return (
		<Container type="hero">
      <div className="relative flex justify-center w-full h-full">
          <div className="flex flex-col justify-start w-full gap-8 h-full z-10" style={{ pointerEvents: 'auto' }}>
              <div className="flex flex-col w-full h-full justify-center items-center">
                  <Container type="jumbotron-title">
                    <h1 className="text-5xl font-medium leading-tight">{config.title.toLowerCase()}</h1>
                  </Container>
              </div>
              <div className="flex w-full h-full justify-center items-center">
                  <ArcadeEmbed />
              </div>
          </div>
      </div>
		</Container>
	);
}