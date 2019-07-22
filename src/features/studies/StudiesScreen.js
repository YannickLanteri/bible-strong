import React from 'react'

import Container from '~common/ui/Container'
import Box from '~common/ui/Box'
import Link from '~common/Link'
import Text from '~common/ui/Text'

import StudiesHeader from './StudiesHeader'
import SelectCategories from './SelectCategories'

const StudiesScreen = () => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (

    <Container>
      <StudiesHeader setIsOpen={setIsOpen} isOpen={isOpen} />
      <Box flex>
        <SelectCategories isOpen={isOpen} setIsOpen={setIsOpen} />
        <Link route='EditStudy'>
          <Text>
        Edit Study
          </Text>
        </Link>

      </Box>
    </Container>
  )
}

export default StudiesScreen