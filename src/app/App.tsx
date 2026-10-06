import { DOCUMENT_PARAGRAPHS, DOCUMENT_TITLE } from '../data/document'
import { WordPicker } from '../features/word-picker/WordPicker'

export function App() {
  return <WordPicker title={DOCUMENT_TITLE} paragraphs={DOCUMENT_PARAGRAPHS} />
}
