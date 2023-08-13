import Replicate from "replicate";

const replicate = new Replicate({
  auth: String(process.env.REPLICATE_API_TOKEN),
});

// const model = "stability-ai/stable-diffusion:27b93a2413e7f36cd83da926f3656280b2931564ff050bf9575f1fdf9bcd7478";
// const input = {
//   prompt: "a 19th century portrait of a raccoon gentleman wearing a suit",
// };
// const output = await replicate.run(model, { input });

export async function generateImage(lyrics: string) {
  const output = await replicate.run(
    "ai-forever/kandinsky-2.2:ea1addaab376f4dc227f5368bbd8eff901820fd1cc14ed8cad63b29249e9d463",
    {
      input: {
        prompt: `An illustration describing the song with the following lyrics """
        ${lyrics}
        """
        digital painting, art, fluid, illustration`,
        negative_prompt: "alphanumeric symbols",
      },
    }
  );

  return output;
}
