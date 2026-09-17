import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  const sortedPosts = posts.sort((a, b) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime());

  return rss({
    title: '好酸球性胃腸炎と複合難病の闘病・服薬ノート',
    description: '好酸球性消化管疾患・群発頭痛・重症喘息・小麦アレルギー当事者のリアルな治療・服薬記録',
    site: context.site,
    items: sortedPosts.map(post => ({
      title: post.data.title,
      pubDate: new Date(post.data.pubDate),
      description: post.data.description,
      link: `/blog/${post.data.slug}/`,
    })),
    customData: `<language>ja-jp</language>`,
  });
}
