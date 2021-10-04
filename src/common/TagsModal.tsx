import React, { useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import styled from '@emotion/native'
import * as Icon from '@expo/vector-icons'
import { useSelector, useDispatch } from 'react-redux'
import { getBottomSpace } from 'react-native-iphone-x-helper'

import TextInput from '~common/ui/TextInput'
import Box from '~common/ui/Box'
import Text from '~common/ui/Text'
import Chip from '~common/ui/Chip'
import { addTag } from '~redux/modules/user'
import { useTranslation } from 'react-i18next'
import Modal from './Modal'
import { hp } from '~helpers/utils'

const StyledIcon = styled(Icon.Feather)(({ theme, isDisabled }) => ({
  marginLeft: 10,
  color: isDisabled ? theme.colors.border : theme.colors.primary,
}))

const TagsModal = ({ isVisible, onClosed, onSelected, selectedChip }) => {
  const [newTag, setNewTag] = useState('')
  const dispatch = useDispatch()
  const tags = useSelector(state => Object.values(state.user.bible.tags))
  const { t } = useTranslation()

  const saveTag = () => {
    if (!newTag.trim()) {
      return
    }
    dispatch(addTag(newTag.trim()))
    setNewTag('')
  }

  return (
    <Modal.Menu
      isOpen={isVisible}
      onClose={onClosed}
      HeaderComponent={
        <Box padding={20}>
          <Text bold>{t('Étiquettes')}</Text>
        </Box>
      }
      FooterComponent={
        <Box row center marginBottom={10} marginLeft={20} marginRight={20}>
          <Box flex>
            <TextInput
              placeholder={t('Créer un nouveau tag')}
              onChangeText={setNewTag}
              onSubmitEditing={saveTag}
              returnKeyType="send"
              value={newTag}
            />
          </Box>
          <TouchableOpacity onPress={saveTag}>
            <StyledIcon isDisabled={!newTag} name="check" size={30} />
          </TouchableOpacity>
        </Box>
      }
      modalHeight={hp(60, 600)}
    >
      <Box flex>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
          <Box row wrap>
            <Chip
              label={t('Tout')}
              isSelected={!selectedChip}
              onPress={() => onSelected(null)}
            />
            {tags.map(chip => (
              <Chip
                key={chip.id}
                label={chip.name}
                isSelected={selectedChip && chip.name === selectedChip.name}
                onPress={() => onSelected(chip)}
              />
            ))}
          </Box>
        </ScrollView>
      </Box>
    </Modal.Menu>
  )
}

export default TagsModal
