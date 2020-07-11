import React, { useEffect, useState } from 'react'
import { Share } from 'react-native'
import styled from '@emotion/native'
import * as Icon from '@expo/vector-icons'
import truncHTML from 'trunc-html'
import { useDispatch, useSelector } from 'react-redux'
import * as Sentry from '@sentry/react-native'

import Button from '~common/ui/Button'
import NaveHTMLView from '~common/NaveHTMLView'
import Back from '~common/Back'
import Link from '~common/Link'
import Container from '~common/ui/Container'
import Text from '~common/ui/Text'
import ScrollView from '~common/ui/ScrollView'
import Box from '~common/ui/Box'
import { setHistory } from '~redux/modules/user'
import { MAX_WIDTH } from '~helpers/useDimensions'

import waitForDatabase from '~common/waitForNaveDB'
import loadNaveItem from '~helpers/loadNaveItem'
import Snackbar from '~common/SnackBar'
import MultipleTagsModal from '~common/MultipleTagsModal'
import TagList from '~common/TagList'

const MAX_CHAR = 3000

const FeatherIcon = styled(Icon.Feather)(({ theme }) => ({
  color: theme.colors.default,
}))

const TitleBorder = styled.View(({ theme }) => ({
  marginTop: 10,
  width: 35,
  height: 3,
  backgroundColor: theme.colors.quint,
}))

const NaveDetailScreen = ({ navigation }) => {
  const { name_lower, name } = navigation.state.params || {}
  const dispatch = useDispatch()
  const [naveItem, setNaveItem] = useState(null)
  const [canReadMore, setCanReadMore] = useState(false)
  const [multipleTagsItem, setMultipleTagsItem] = useState(false)
  const tags = useSelector(state => state.user.bible.naves[name_lower]?.tags)

  useEffect(() => {
    loadNaveItem(name_lower).then(result => {
      if (result.description.length > 7000) {
        setCanReadMore(true)
      }

      setNaveItem({
        ...result,
        descriptionShort: truncHTML(result.description, MAX_CHAR).html,
      })
      dispatch(
        setHistory({
          name: result.name,
          name_lower: result.name_lower,
          type: 'nave',
        })
      )
    })
  }, [dispatch, name, name_lower])

  const openLink = href => {
    const [type, item] = href.split('=')

    if (type === 'v') {
      try {
        const [book, chapter, verses] = item.split('-')
        const [verse] = verses ? verses.split(',') : []
        navigation.navigate('BibleView', {
          isReadOnly: true,
          book: Number(book),
          chapter: Number(chapter),
          verse: Number(verse),
          focusVerses: verses?.split(',').map(Number),
        })
      } catch (e) {
        console.log(e)
        Snackbar.show('Impossible de charger ce verset.')
        Sentry.captureMessage(
          `Something went wrong with verse ${href} in ${name}`
        )
      }
    }

    if (type === 'w') {
      navigation.navigate({
        routeName: 'NaveDetail',
        params: {
          name_lower: item,
        },
        key: name_lower,
      })
    }
  }

  const shareDefinition = () => {
    try {
      const message = `${name} \n\n${truncHTML(naveItem.description, 4000)
        .text.replace(/&#/g, '\\')
        .replace(/\\x([0-9A-F]+);/gi, function() {
          return String.fromCharCode(parseInt(arguments[1], 16))
        })} \n\nLa suite sur https://bible-strong.app`

      Share.share({ message })
    } catch (e) {
      Snackbar.show('Erreur lors du partage.')
      console.log(e)
      Sentry.captureException(e)
    }
  }

  const loadRemainingText = () => {
    setCanReadMore(false)
  }

  return (
    <Container>
      <Box
        padding={20}
        maxWidth={MAX_WIDTH}
        width="100%"
        marginLeft="auto"
        marginRight="auto"
      >
        <Box style={{ flexDirection: 'row' }}>
          <Box flex>
            <Back>
              <Text title fontSize={22}>
                {naveItem?.name || name}
              </Text>
            </Back>
            {naveItem?.name_lower && (
              <Text color="grey" fontSize={12}>
                ({naveItem.name_lower})
              </Text>
            )}
          </Box>
          <Link
            onPress={() =>
              setMultipleTagsItem({
                id: naveItem.name_lower,
                title: naveItem.name,
                entity: 'naves',
              })
            }
          >
            <FeatherIcon
              style={{
                paddingTop: 10,
                paddingHorizontal: 5,
                marginRight: 10,
              }}
              name="tag"
              size={20}
            />
          </Link>
          <Link onPress={() => {}}>
            <FeatherIcon
              style={{ paddingTop: 10, paddingHorizontal: 5, marginRight: 10 }}
              name="share-2"
              size={20}
              onPress={shareDefinition}
            />
          </Link>
          <Back>
            <FeatherIcon
              style={{ paddingTop: 10, paddingHorizontal: 5 }}
              name="minimize-2"
              size={20}
            />
          </Back>
        </Box>

        <TitleBorder />
      </Box>
      <ScrollView style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}>
        {tags && (
          <Box marginBottom={10}>
            <TagList tags={tags} />
          </Box>
        )}
        {naveItem && naveItem.description && (
          <NaveHTMLView
            value={
              canReadMore ? naveItem.descriptionShort : naveItem.description
            }
            onLinkPress={openLink}
          />
        )}
        {canReadMore && (
          <Box center marginTop={20}>
            <Button onPress={loadRemainingText} style={{ width: 150 }}>
              Lire plus
            </Button>
          </Box>
        )}
      </ScrollView>
      <MultipleTagsModal
        multiple
        item={multipleTagsItem}
        onClosed={() => setMultipleTagsItem(false)}
      />
    </Container>
  )
}

export default waitForDatabase(NaveDetailScreen)