// English-to-Hindi Phonetic Transliteration Engine using Google Input Tools API

/**
 * Transliterates an English word into Hindi using the Google Input Tools API.
 * @param word The English phonetic word (e.g., "kamal")
 * @returns A promise that resolves to the Hindi transliteration (e.g., "कमल")
 */
export async function transliterate(word: string): Promise<string> {
  if (!word || !word.trim()) return word;

  try {
    const response = await fetch(`https://inputtools.google.com/request?text=${encodeURIComponent(word)}&itc=hi-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8&app=reactKeyboard3D`);
    const data = await response.json();

    // Google API returns ["SUCCESS",[["word",["hindi_word"],[],{"candidate_type":[0]}]]]
    if (data[0] === 'SUCCESS' && data[1] && data[1][0] && data[1][0][1] && data[1][0][1][0]) {
      return data[1][0][1][0];
    }
  } catch (error: any) {
    console.error('Transliteration error:', error);
    if (typeof window !== 'undefined') {
      window.alert('Transliteration failed: ' + (error?.message || 'Network error'));
    }
  }

  // Fallback to original word if API fails or network is disconnected
  return word;
}
