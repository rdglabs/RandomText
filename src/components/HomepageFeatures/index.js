import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Easy to Use',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Docusaurus was designed from the ground up to be easily installed and
        used to get your website up and running quickly.
      </>
    ),
  },
  // {
  //   title: 'Focus on What Matters',
  //   Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
  //   description: (
  //     <>
  //       Docusaurus lets you focus on your docs, and we&apos;ll do the chores. Go
  //       ahead and move your docs into the <code>docs</code> directory.
  //     </>
  //   ),
  // },
  // {
  //   title: 'Powered by React',
  //   Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
  //   description: (
  //     <>
  //       Extend or customize your website layout by reusing React. Docusaurus can
  //       be extended while reusing the same header and footer.
  //     </>
  //   ),
  // },
];

async function displayRandomMarkdownValue() {
  // Step 1: Fetch the markdown file
  const response = await fetch('./texts.md');
  
  // Check if the fetch is successful
  if (!response.ok) {
    console.error("Error fetching the markdown file.");
    return;
  }

  // Step 2: Read the content of the file
  const markdownText = await response.text();

  // Step 3: Extract values (assuming they're in list items, e.g., "- Item 1")
  const listItems = markdownText.match(/- (.*?)(?=\n|$)/g);
  
  if (!listItems) {
    console.error("No list items found in the markdown file.");
    return;
  }

  // Step 4: Clean up the extracted values (remove the "- " at the start)
  const values = listItems.map(item => item.replace(/^-\s*/, ''));

  // Step 5: Pick a random value
  const randomValue = values[Math.floor(Math.random() * values.length)];

  // Step 6: Display the random value
  console.log("Random Value: ", randomValue);
}

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          <p></p>
        </div>
      </div>
    </section>
  );
}
