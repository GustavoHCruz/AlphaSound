def group_segments_by_sentence(segments):
	grouped = []
	current = []

	for seg in segments:
		current.append(seg)

		if seg["text"].endswith("."):
			grouped.append(current)
			current = []

	if current:
		grouped.append(current)

	return grouped