import { withTheme } from '@emotion/react'
import { useSetAtom } from 'jotai'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import Modal from '~common/Modal'
import { deleteNote } from '~redux/modules/user'
import { multipleTagsModalAtom } from '../../state/app'

const NotesSettingsModal = ({
  isOpen,
  onClosed,
  theme,
  setTitlePrompt,
  openNoteEditor,
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const noteId = isOpen
  const note = useSelector(
    state => state.user.bible.notes[noteId],
    shallowEqual
  )
  const setMultipleTagsItem = useSetAtom(multipleTagsModalAtom)

  const deleteNoteConfirmation = id => {
    Alert.alert(
      t('Attention'),
      t('Voulez-vous vraiment supprimer cette note?'),
      [
        { text: t('Non'), onPress: () => null, style: 'cancel' },
        {
          text: t('Oui'),
          onPress: () => dispatch(deleteNote(id), onClosed()),
          style: 'destructive',
        },
      ]
    )
  }

  return (
    <Modal.Body isOpen={!!isOpen} onClose={onClosed} adjustToContentHeight>
      <Modal.Item
        onPress={() => {
          onClosed()
          setTimeout(() => {
            openNoteEditor(noteId)
          }, 500)
        }}
        bold
      >
        {t('Éditer')}
      </Modal.Item>
      <Modal.Item
        onPress={() => {
          onClosed()
          setTimeout(() => {
            setMultipleTagsItem({ ...note, id: noteId, entity: 'notes' })
          }, 500)
        }}
        bold
      >
        {t('Éditer les tags')}
      </Modal.Item>
      <Modal.Item
        bold
        color="quart"
        onPress={() => deleteNoteConfirmation(noteId)}
      >
        {t('Supprimer')}
      </Modal.Item>
    </Modal.Body>
  )
}

export default withTheme(NotesSettingsModal)
